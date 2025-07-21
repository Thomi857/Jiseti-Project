import pytest

@pytest.fixture
def client():
    from backend.app import app

    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def runner():
    from backend.app import app

    app.config['TESTING'] = True
    with app.app_context():
        yield app.test_cli()