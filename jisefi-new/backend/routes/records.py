from flask import Blueprint, request, jsonify, abort
from backend.models import db, Record, User
from sqlalchemy.exc import IntegrityError

bp = Blueprint("records", __name__, url_prefix="/records")

# GET /records — list all
@bp.route("/", methods=["GET"])
def get_records():
    records = Record.query.all()
    return jsonify([record.to_dict() for record in records]), 200

# GET /records/<id> — single record
@bp.route("/<int:id>", methods=["GET"])
def get_record(id):
    record = Record.query.get_or_404(id)
    return jsonify(record.to_dict()), 200

# POST /records — create new
@bp.route("/", methods=["POST"])
def create_record():
    data = request.get_json()
    try:
        new_record = Record(
            title=data["title"],
            description=data.get("description"),
            user_id=data.get("user_id")
        )
        db.session.add(new_record)
        db.session.commit()
        return jsonify(new_record.to_dict()), 201
    except (KeyError, IntegrityError):
        db.session.rollback()
        abort(400, description="Invalid data provided")

# PATCH /records/<id> — update
@bp.route("/<int:id>", methods=["PATCH"])
def update_record(id):
    record = Record.query.get_or_404(id)
    data = request.get_json() or {}

    if "title" in data:
        record.title = data["title"]
    if "description" in data:
        record.description = data["description"]
    if "user_id" in data:
        user = User.query.get(data["user_id"])
        if not user:
            abort(404, description="User not found")
        record.user_id = user.id

    try:
        db.session.commit()
        return jsonify(record.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        abort(400, description="Update failed due to invalid data")

# DELETE /records/<id> — delete
# DELETE /records/<id>
@bp.route("/<int:id>", methods=["DELETE"])
def delete_record(id):
    record = Record.query.get_or_404(id)

    try:
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": f"Record {id} deleted"}), 200
    except:
        db.session.rollback()
        abort(500, description="Could not delete record")
