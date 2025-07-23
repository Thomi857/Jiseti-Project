from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Record

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/records/<int:record_id>/status', methods=['PATCH'])
def change_record_status(record_id):
    data = request.get_json()
    new_status = data.get('status')

    record = Record.query.get(record_id)
    if not record:
        return jsonify({'message': 'Record not found'}), 404

    record.status = new_status
    db.session.commit()

    return jsonify({'message': 'Record status updated successfully'}), 200

@admin_bp.route('/admin/records', methods=['GET'])
def get_all_records():
    records = Record.query.all()
    return jsonify([record.to_dict() for record in records]), 200

@admin_bp.route('/admin/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    record = Record.query.get(record_id)
    if not record:
        return jsonify({'message': 'Record not found'}), 404

    db.session.delete(record)
    db.session.commit()

    return jsonify({'message': 'Record deleted successfully'}), 200
