from fastapi.testclient import TestClient
from sqlmodel import Session
from app.tests.utils import create_category, create_task_in_db  # Import your get_db dependency


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