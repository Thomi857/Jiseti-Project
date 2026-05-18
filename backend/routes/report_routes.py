from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Report
from auth import can_edit_report, can_delete_report, can_update_status
import logging
from decimal import Decimal, InvalidOperation

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports', methods=['GET'])
def get_reports():
    try:
        reports = Report.get_all()
        return jsonify(reports), 200
    except Exception as e:
        logging.error(f"Error fetching all reports: {e}", exc_info=True)
        return jsonify({'error': 'Failed to fetch reports'}), 500


@reports_bp.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Authentication required or invalid token'}), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    record_type = data.get('record_type')
    latitude_raw = data.get('latitude')
    longitude_raw = data.get('longitude')

    if not all([title, description, record_type, latitude_raw, longitude_raw]):
        missing_fields = [f for f, v in {
            'title': title, 'description': description, 'record_type': record_type,
            'latitude': latitude_raw, 'longitude': longitude_raw
        }.items() if v is None]
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    if record_type not in ['red_flag', 'intervention']:
        return jsonify({'error': 'Invalid record type. Must be "red_flag" or "intervention"'}), 400

    try:
        latitude = Decimal(str(float(latitude_raw)))
        longitude = Decimal(str(float(longitude_raw)))
    except (TypeError, ValueError, InvalidOperation) as e:
        logging.error(f"Invalid lat/lng format: {e}", exc_info=True)
        return jsonify({'error': 'Latitude and longitude must be numeric'}), 422

    try:
        report = Report.create(title, description, record_type, latitude, longitude, user_id)
        if not report:
            return jsonify({'error': 'Failed to create report.'}), 500
        return jsonify(report), 201
    except Exception as e:
        logging.error(f"Error creating report: {e}", exc_info=True)
        return jsonify({'error': 'Server error during report creation'}), 500


@reports_bp.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json()

    try:
        report = Report.get_by_id(report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404

        if not can_edit_report(report, user_id):
            return jsonify({'error': 'Unauthorized to edit this report'}), 403

        update_data = {}

        if report['user_id'] == user_id and report['status'] == 'draft':
            if 'title' in data:
                update_data['title'] = data['title']
            if 'description' in data:
                update_data['description'] = data['description']

            if 'latitude' in data or 'longitude' in data:
                if 'latitude' not in data or 'longitude' not in data:
                    return jsonify({'error': 'Both latitude and longitude must be provided'}), 400
                try:
                    update_data['latitude'] = Decimal(str(float(data['latitude'])))
                    update_data['longitude'] = Decimal(str(float(data['longitude'])))
                except (TypeError, ValueError, InvalidOperation) as e:
                    return jsonify({'error': 'Invalid latitude/longitude'}), 422

        if 'status' in data:
            if data['status'] not in ['draft', 'under_investigation', 'rejected', 'resolved']:
                return jsonify({'error': 'Invalid status value'}), 400
            if can_update_status(user_id):
                update_data['status'] = data['status']
            else:
                return jsonify({'error': 'Unauthorized to update status'}), 403

        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400

        updated_report = Report.update(report_id, update_data)
        if not updated_report:
            return jsonify({'error': 'Failed to update report'}), 500

        return jsonify(updated_report), 200

    except Exception as e:
        logging.error(f"Update error: {e}", exc_info=True)
        return jsonify({'error': 'Server error during update'}), 500


@reports_bp.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    if user_id is None:
        return jsonify({'error': 'Authentication required'}), 401

    try:
        report = Report.get_by_id(report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404

        if not can_delete_report(report, user_id):
            logging.warning(f"User {user_id} not authorized to delete report {report_id}")
            return jsonify({'error': 'Not authorized to delete this report'}), 403

        success = Report.delete(report_id)
        if not success:
            return jsonify({'error': 'Failed to delete report'}), 500

        return jsonify({'message': 'Report deleted successfully'}), 200

    except Exception as e:
        logging.error(f"Delete error for report {report_id}: {e}", exc_info=True)
        return jsonify({'error': 'Server error during deletion'}), 500
