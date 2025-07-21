from flask import Flask
from .extensions import db, migrate
from .routes.init import register_routes
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    # Import your models to register them with SQLAlchemy
    from .models import User

    register_routes(app)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)