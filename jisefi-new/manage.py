from flask.cli import FlaskGroup
from backend import create_app
from backend.extensions import db
from backend.models import Record  # import all models here so Migrate can detect them

app = create_app()

cli = FlaskGroup(app)

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5002)