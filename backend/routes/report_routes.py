from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Report
from auth import can_edit_report, can_delete_report, can_update_status
import logging

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports', methods=['GET'])
def get_reports():
    try:
        reports = Report.get_all()
        return jsonify(reports), 200
    except Exception as e:
        logging.error(f"Get reports error: {e}")
        return jsonify({'error': 'Failed to fetch reports'}), 500

@reports_bp.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    title = data.get('title')
    description = data.get('description')
    record_type = data.get('record_type')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if not all([title, description, record_type, latitude, longitude]):
        return jsonify({'error': 'All fields are required'}), 400
    
    if record_type not in ['red_flag', 'intervention']:
        return jsonify({'error': 'Invalid record type'}), 400
    
    try:
        report = Report.create(title, description, record_type, latitude, longitude, user_id)
        
        if not report:
            return jsonify({'error': 'Failed to create report'}), 500
        
        return jsonify(report), 201
        
    except Exception as e:
        logging.error(f"Create report error: {e}")
        return jsonify({'error': 'Failed to create report'}), 500

@reports_bp.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Get current report
        report = Report.get_by_id(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check permissions
        if not can_edit_report(report, user_id):
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Prepare update data
        update_data = {}
        
        # Content updates (only if user is owner and status is draft)
        if report['user_id'] == user_id and report['status'] == 'draft':
            if 'title' in data:
                update_data['title'] = data['title']
            if 'description' in data:
                update_data['description'] = data['description']
            if 'latitude' in data and 'longitude' in data:
                update_data['latitude'] = data['latitude']
                update_data['longitude'] = data['longitude']
        
        # Status updates (only if user is admin)
        if 'status' in data and can_update_status(user_id):
            update_data['status'] = data['status']
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        updated_report = Report.update(report_id, update_data)
        
        if not updated_report:
            return jsonify({'error': 'Failed to update report'}), 500
        
        return jsonify(updated_report), 200
        
    except Exception as e:
        logging.error(f"Update report error: {e}")
        return jsonify({'error': 'Failed to update report'}), 500

@reports_bp.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    
    try:
        # Get report
        report = Report.get_by_id(report_id)
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Check permissions
        if not can_delete_report(report, user_id):
            return jsonify({'error': 'Unauthorized or report not in draft status'}), 403
        
        success = Report.delete(report_id)
        
        if not success:
            return jsonify({'error': 'Failed to delete report'}), 500
        
        return jsonify({'message': 'Report deleted successfully'}), 200
        
    except Exception as e:
        logging.error(f"Delete report error: {e}")
        return jsonify({'error': 'Failed to delete report'}), 500