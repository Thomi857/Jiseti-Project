from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import Record

records_bp = Blueprint('records', __name__)

@records_bp.route('/records', methods=['GET'])
def get_records():
    records = Record.query.all()
    return jsonify([record.to_dict() for record in records]), 200

@records_bp.route('/records', methods=['POST'])
def create_record():
    data = request.get_json()
    new_record = Record(**data)
    db.session.add(new_record)
    db.session.commit()
    return jsonify(new_record.to_dict()), 201

@records_bp.route('/records/<int:record_id>', methods=['GET'])
def get_record(record_id):
    record = Record.query.get_or_404(record_id)
    return jsonify(record.to_dict()), 200

@records_bp.route('/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.get_json()
    record = Record.query.get_or_404(record_id)
    for key, value in data.items():
        setattr(record, key, value)
    db.session.commit()
    return jsonify(record.to_dict()), 200

@records_bp.route('/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    record = Record.query.get_or_404(record_id)
    db.session.delete(record)
    db.session.commit()
    return '', 204
