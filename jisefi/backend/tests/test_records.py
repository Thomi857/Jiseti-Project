import pytest
from backend.app import app as flask_app
from backend.models import db, Record

@pytest.fixture
def app():
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_create_record(client):
    response = client.post('/records', json={
        'title': 'Test Record',
        'description': 'This is a test record.'
    })
    assert response.status_code == 201
    assert 'id' in response.get_json()

def test_get_record(client):
    record = Record(title='Test Record', description='This is a test record.')
    db.session.add(record)
    db.session.commit()

    response = client.get(f'/records/{record.id}')
    assert response.status_code == 200
    assert response.get_json()['title'] == 'Test Record'

def test_update_record(client):
    record = Record(title='Old Title', description='Old description.')
    db.session.add(record)
    db.session.commit()

    response = client.put(f'/records/{record.id}', json={
        'title': 'Updated Title',
        'description': 'Updated description.'
    })
    assert response.status_code == 200
    updated_record = Record.query.get(record.id)
    assert updated_record.title == 'Updated Title'

def test_delete_record(client):
    record = Record(title='Record to Delete', description='This record will be deleted.')
    db.session.add(record)
    db.session.commit()

    response = client.delete(f'/records/{record.id}')
    assert response.status_code == 204
    assert Record.query.get(record.id) is None