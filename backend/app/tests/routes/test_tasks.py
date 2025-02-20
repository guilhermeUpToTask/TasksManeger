import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine

from app.models.task import Task
from app.models.category import Category
from app.main import app  # Import your FastAPI app
from app.api.deps import get_db  # Import your get_db dependency

@pytest.fixture(scope="session")
def test_engine():
    # Use an in-memory SQLite database with shared cache
    engine = create_engine(
        "sqlite:///:memory:?cache=shared",
        connect_args={"check_same_thread": False}
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(scope="session")
def connection(test_engine):
    with test_engine.connect() as conn:
        yield conn

@pytest.fixture(scope="function")
def db_session(connection):
    # Start a nested transaction and create a session for each test
    transaction = connection.begin_nested()
    session = Session(bind=connection)
    yield session
    session.close()
    transaction.rollback()  # Rollback after test to reset database

@pytest.fixture(scope="function")
def client(db_session):
    # Override the get_db dependency to use the test session
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()



# Helper function to create a category (for testing tasks with category_id)
def create_category(session: Session, name="Test Category", description="Test Category Description"):
    category = Category(name=name, description=description)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

# Helper function to create a task directly in the DB
def create_task_in_db(session: Session, category_id: int, name="Test Task", description="Test Description"):
    
    task_data = {"name": name, "description": description, "category_id": category_id}
    task = Task(**task_data)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def test_read_empty_tasks(client: TestClient):
    response = client.get("/tasks/")
    assert response.status_code == 200
    # Initially, there should be no tasks
    assert response.json() == []

def test_create_task_without_status(client: TestClient, db_session: Session):
    # First, create a category in the database.
    category = create_category(db_session)
    # Test creation when no status is provided.
    payload = {
        "name": "New Task",
        "description": "Task description",
        "category_id": category.id
    }
    response = client.post("/tasks/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Task"
    assert data["description"] == "Task description"
    assert data["category_id"] == category.id


def test_create_task_without_category(client: TestClient):
    # Test creation when no category is provided.
    payload = {
        "name": "New Task",
        "description": "Task description",
        "category_id": None
    }
    response = client.post("/tasks/", json=payload)
    assert response.status_code == 422
    data = response.json()

def test_create_task_with_invalid_category(client: TestClient):
    # Test creation with a non-existent category_id.
    payload = {
        "name": "Task With Invalid Category",
        "description": "Some description",
        "category_id": 999  # assuming this ID does not exist
    }
    response = client.post("/tasks/", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not Found"


def test_create_task_with_category(client: TestClient, db_session: Session):
    # First, create a category in the database.
    category = create_category(db_session)
    payload = {
        "name": "Task With Category",
        "description": "Some description",
        "category_id": category.id
    }
    response = client.post("/tasks/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Task With Category"
    assert data["category_id"] == category.id


def test_read_task(client: TestClient, db_session: Session):
    #Create a category first
    category = create_category(db_session)
    # Create a task directly in the DB.
    task = create_task_in_db(db_session, category.id)
    response = client.get(f"/tasks/{task.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task.id
    assert data["name"] == task.name


def test_read_task_not_found(client: TestClient):
    response = client.get("/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task Not Found"


def test_update_task(client: TestClient, db_session: Session):
    category = create_category(db_session)
    task = create_task_in_db(db_session, category.id)
    update_payload = {
        "name": "Updated Name",
        "description": "Updated Description"
    }
    response = client.put(f"/tasks/{task.id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "Updated Description"


def test_update_task_not_found(client: TestClient):
    update_payload = {
        "name": "Updated Name",
        "description": "Updated Description"
    }
    response = client.put("/tasks/999", json=update_payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Task Not Found"


def test_delete_task(client: TestClient, db_session: Session):
    category = create_category(db_session)
    task = create_task_in_db(db_session, category.id)
    response = client.delete(f"/tasks/{task.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task.id

    # Verify that the task no longer exists.
    response = client.get(f"/tasks/{task.id}")
    assert response.status_code == 404


def test_delete_task_not_found(client: TestClient):
    response = client.delete("/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task Not Found"