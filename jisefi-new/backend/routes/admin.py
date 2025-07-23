# Example: auth.py
from flask import Blueprint, request, jsonify, abort
from backend.models import User
from backend.extensions import db
from sqlalchemy.exc import IntegrityError

bp = Blueprint("admin", __name__, url_prefix="/admin")


@bp.route("/ping")
def ping():
    return {"message": "Admin route works!"}

@bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    } for user in users]), 200


@bp.route("/users/<int:id>", methods=["PATCH"])
def update_user_admin_status(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    if "is_admin" in data:
        user.is_admin = data["is_admin"]

        try:
            db.session.commit()
            return jsonify({
                "id": user.id,
                "username": user.username,
                "is_admin": user.is_admin
            }), 200
        except IntegrityError:
            db.session.rollback()
            abort(400, description="Failed to update admin status.")
    else:
        abort(400, description="Missing 'is_admin' field in request.")

@bp.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": f"User {id} deleted"}), 200
    except:
        db.session.rollback()
        abort(500, description="Could not delete user.")
    
    admin = User(
        username="admin",
        email="admin@example.com",
        password_hash=generate_password_hash("admin123"),
        is_admin=True
    )

    db.session.add(admin)
    db.session.commit()