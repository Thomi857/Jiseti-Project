import pytest
from backend.app import create_app
from backend.extensions import db
from backend.models import User, Record

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_admin_access(client):
    # Assuming you have a way to create an admin user
    admin_user = User(username='admin', password='password', is_admin=True)
    db.session.add(admin_user)
    db.session.commit()

    # Simulate login
    response = client.post('/auth/login', data={
        'username': 'admin',
        'password': 'password'
    })
    assert response.status_code == 200

    # Test admin route
    response = client.get('/admin/some_admin_route')
    assert response.status_code == 200

def test_non_admin_access(client):
    # Create a non-admin user
    non_admin_user = User(username='user', password='password', is_admin=False)
    db.session.add(non_admin_user)
    db.session.commit()

    # Simulate login
    response = client.post('/auth/login', data={
        'username': 'user',
        'password': 'password'
    })
    assert response.status_code == 200

    # Test admin route
    response = client.get('/admin/some_admin_route')
    assert response.status_code == 403  # Forbidden access for non-admins

def test_create_record_as_admin(client):
    # Assuming admin user is already logged in
    admin_user = User(username='admin', password='password', is_admin=True)
    db.session.add(admin_user)
    db.session.commit()

    response = client.post('/auth/login', data={
        'username': 'admin',
        'password': 'password'
    })
    assert response.status_code == 200

    # Create a record
    response = client.post('/admin/create_record', json={
        'title': 'Test Record',
        'description': 'This is a test record.'
    })
    assert response.status_code == 201  # Created

    # Verify the record is in the database
    record = Record.query.filter_by(title='Test Record').first()
    assert record is not None
    assert record.description == 'This is a test record.'