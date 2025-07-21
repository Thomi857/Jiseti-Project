import pytest
from backend.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register(client):
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 201
    assert b'Registration successful' in response.data

def test_login(client):
    client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    response = client.post('/auth/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200
    assert b'Login successful' in response.data

def test_login_invalid_user(client):
    response = client.post('/auth/login', json={
        'username': 'invaliduser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert b'Invalid credentials' in response.data

def test_register_existing_user(client):
    client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'password': 'newpassword'
    })
    assert response.status_code == 400
    assert b'User already exists' in response.data