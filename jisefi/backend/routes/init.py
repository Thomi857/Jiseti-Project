from flask import Blueprint

main = Blueprint('main', __name__)

from . import auth, records, admin

def register_routes(app):
    app.register_blueprint(main)
