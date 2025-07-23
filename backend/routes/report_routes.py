from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Report
from auth import can_edit_report, can_delete_report, can_update_status
import logging
from decimal import Decimal, InvalidOperation # Import Decimal and InvalidOperation for precise number handling

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports', methods=['GET'])
def get_reports():
    """
    Retrieves all reports from the database.
    """
    try:
        reports = Report.get_all()
        return jsonify(reports), 200
    except Exception as e:
        logging.error(f"Error fetching all reports: {e}", exc_info=True)
        return jsonify({'error': 'Failed to fetch reports'}), 500

@reports_bp.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    """
    Creates a new report. Requires a valid JWT token.
    Validates input data including type and format for latitude/longitude.
    """
    user_id = get_jwt_identity()
    # 1. Authentication check: Ensure a valid user ID is obtained from the JWT.
    if user_id is None:
        logging.warning("Attempted to create report without valid user_id from JWT.")
        return jsonify({'error': 'Authentication required or invalid token'}), 401 # Unauthorized

    data = request.get_json()
    
    # Extract data from the request, using .get() for safety to avoid KeyError
    title = data.get('title')
    description = data.get('description')
    record_type = data.get('record_type')
    latitude_raw = data.get('latitude') 
    longitude_raw = data.get('longitude') 
    
    # 2. Basic presence validation: Check if all required fields are provided.
    if not all([title, description, record_type, latitude_raw, longitude_raw]):
        missing_fields = [f for f, v in {
            'title': title, 'description': description, 'record_type': record_type,
            'latitude': latitude_raw, 'longitude': longitude_raw
        }.items() if v is None]
        logging.warning(f"Missing required fields for report creation: {', '.join(missing_fields)}")
        return jsonify({'error': f'All required fields are missing: {", ".join(missing_fields)}'}), 400
    
    # 3. Enumerated type validation for record_type.
    if record_type not in ['red_flag', 'intervention']:
        logging.warning(f"Invalid record_type received: {record_type}")
        return jsonify({'error': 'Invalid record type. Must be "red_flag" or "intervention"'}), 400
    
    # 4. Latitude and Longitude type and precision validation.
    #    This is where 422 (Unprocessable Entity) is most appropriate if format is wrong.
    try:
        # First, ensure latitude_raw and longitude_raw are convertible to float.
        # This catches cases like "abc" for latitude.
        latitude = float(latitude_raw)
        longitude = float(longitude_raw)
        
        # Then, convert to Decimal using string representation for precision when inserting into DB.
        # This mitigates floating-point precision issues with PostgreSQL's DECIMAL type.
        latitude = Decimal(str(latitude))
        longitude = Decimal(str(longitude))
    except (TypeError, ValueError, InvalidOperation) as e:
        # Catch errors if latitude_raw/longitude_raw are not numbers or cannot be converted to Decimal.
        logging.error(f"Latitude/longitude data format error: {latitude_raw}, {longitude_raw}. Error: {e}", exc_info=True)
        return jsonify({'error': 'Latitude and longitude must be valid numeric values'}), 422 # Use 422 for data format issues

    # 5. Attempt to create the report in the database.
    try:
        # Pass the validated and converted latitude/longitude to the model.
        report = Report.create(title, description, record_type, latitude, longitude, user_id)
        
        if not report:
            # If Report.create returns None, it indicates a failure within the model/database layer.
            # This could be due to a unique constraint violation, foreign key error (if user_id didn't exist), etc.
            logging.error(f"Report.create returned None for user_id {user_id} with data: {data}. Possible database constraint violation or unexpected error.")
            return jsonify({'error': 'Failed to create report due to a database issue. Please check server logs for more details.'}), 500
        
        # Return the newly created report with 201 Created status.
        return jsonify(report), 201 
        
    except Exception as e:
        # Catch any other unexpected exceptions during the database interaction.
        logging.error(f"Unexpected error during report creation: {e}", exc_info=True)
        return jsonify({'error': 'Failed to create report due to an unexpected server error.'}), 500

@reports_bp.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    """
    Updates an existing report. Requires a valid JWT token.
    Permissions (owner, admin) and report status (draft) are checked.
    """
    user_id = get_jwt_identity()
    if user_id is None:
        logging.warning("Attempted to update report without valid user_id from JWT.")
        return jsonify({'error': 'Authentication required or invalid token'}), 401

    data = request.get_json()
    
    try:
        # Retrieve the existing report to check its current state and ownership.
        report = Report.get_by_id(report_id)
        
        if not report:
            logging.info(f"Report with ID {report_id} not found for update.")
            return jsonify({'error': 'Report not found'}), 404
        
        # Check if the user has permission to edit this specific report.
        if not can_edit_report(report, user_id):
            logging.warning(f"User {user_id} unauthorized to edit report {report_id}.")
            return jsonify({'error': 'Unauthorized to edit this report'}), 403
        
        update_data = {}
        
        # Handle content updates (title, description, lat/long)
        # Only allowed if the user is the owner AND the report status is 'draft'.
        if report['user_id'] == user_id and report['status'] == 'draft':
            if 'title' in data:
                update_data['title'] = data['title']
            if 'description' in data:
                update_data['description'] = data['description']
            
            # If either latitude or longitude is provided, both must be provided and valid.
            if 'latitude' in data or 'longitude' in data:
                if 'latitude' not in data or 'longitude' not in data:
                    return jsonify({'error': 'Both latitude and longitude must be provided together for update'}), 400
                try:
                    # Validate and convert latitude/longitude during update as well.
                    latitude = Decimal(str(float(data['latitude'])))
                    longitude = Decimal(str(float(data['longitude'])))
                    update_data['latitude'] = latitude
                    update_data['longitude'] = longitude
                except (TypeError, ValueError, InvalidOperation) as e:
                    logging.error(f"Update latitude/longitude data format error: {data.get('latitude')}, {data.get('longitude')}. Error: {e}", exc_info=True)
                    return jsonify({'error': 'Latitude and longitude must be valid numeric values for update'}), 422
            
        # Handle status updates (only if user is an admin).
        if 'status' in data:
            if data['status'] not in ['draft', 'under_investigation', 'rejected', 'resolved']:
                logging.warning(f"Invalid status value received for update: {data['status']}")
                return jsonify({'error': 'Invalid status value. Must be one of: draft, under_investigation, rejected, resolved'}), 400
            
            if can_update_status(user_id): # This function should internally check if the user is an admin.
                update_data['status'] = data['status']
            else:
                logging.warning(f"User {user_id} attempted to update status of report {report_id} without admin privileges.")
                return jsonify({'error': 'Unauthorized to update report status'}), 403
        
        # If no valid fields were provided for update, or no allowed changes.
        if not update_data:
            return jsonify({'error': 'No valid fields to update or no changes allowed for current report status/user role'}), 400
        
        # Attempt to update the report in the database.
        updated_report = Report.update(report_id, update_data)
        
        if not updated_report:
            logging.error(f"Report.update returned None for report_id {report_id} with data: {update_data}. Database issue?")
            return jsonify({'error': 'Failed to update report in database. Check server logs.'}), 500
        
        return jsonify(updated_report), 200
        
    except Exception as e:
        logging.error(f"Unexpected error during report update for ID {report_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to update report due to an unexpected server error'}), 500

@reports_bp.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    """
    Deletes a report. Requires a valid JWT token.
    Permissions (owner, admin, and draft status) are checked.
    """
    user_id = get_jwt_identity()
    if user_id is None:
        logging.warning("Attempted to delete report without valid user_id from JWT.")
        return jsonify({'error': 'Authentication required or invalid token'}), 401
    
    try:
        report = Report.get_by_id(report_id)
        
        if not report:
            logging.info(f"Report with ID {report_id} not found for deletion.")
            return jsonify({'error': 'Report not found'}), 404
        
        # Check if the user has permission to delete this specific report.
        if not can_delete_report(report, user_id):
            logging.warning(f"User {user_id} unauthorized to delete report {report_id} (or not in draft status).")
            return jsonify({'error': 'Unauthorized to delete this report or report not in draft status'}), 403
        
        # Attempt to delete the report from the database.
        success = Report.delete(report_id)
        
        if not success:
            logging.error(f"Report.delete returned False for report_id {report_id}. Database issue?")
            return jsonify({'error': 'Failed to delete report in database. Check server logs.'}), 500
        
        return jsonify({'message': 'Report deleted successfully'}), 200
        
    except Exception as e:
        logging.error(f"Unexpected error during report deletion for ID {report_id}: {e}", exc_info=True)
        return jsonify({'error': 'Failed to delete report due to an unexpected server error'}), 500