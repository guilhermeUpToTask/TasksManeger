from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models.category import Category


def test_read_categories_empty(client: TestClient):
    response = client.get("/categories/")
    assert response.status_code == 200
    assert response.json() == []

def test_read_categories_with_data(client: TestClient, db_session: Session):
    category = Category(name="Test", description="Test description")
    db_session.add(category)
    db_session.commit()
    response = client.get("/categories/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test"
    assert data[0]["description"] == "Test description"

def test_read_category_exists(client: TestClient, db_session: Session):
    category = Category(name="Test", description="Test description")
    db_session.add(category)
    db_session.commit()
    response = client.get(f"/categories/{category.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test"
    assert data["description"] == "Test description"

def test_read_category_not_found(client: TestClient):
    response = client.get("/categories/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not Found"

def test_create_category(client: TestClient, db_session: Session):
    data = {"name": "New Category", "description": "New Description"}
    response = client.post("/categories/", json=data)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "New Category"
    assert response_data["description"] == "New Description"
    
    # Verify database entry
    category = db_session.get(Category, response_data["id"])
    assert category is not None
    assert category.name == "New Category"

def test_create_category_invalid_data(client: TestClient):
    # Missing description
    data = {"name": "Invalid Category"}
    response = client.post("/categories/", json=data)
    assert response.status_code == 422

def test_update_category(client: TestClient, db_session: Session):
    category = Category(name="Original", description="Original description")
    db_session.add(category)
    db_session.commit()
    
    update_data = {"name": "Updated", "description": "Updated description"}
    response = client.put(f"/categories/{category.id}", json=update_data)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "Updated"
    assert response_data["description"] == "Updated description"
    
    # Verify database update
    updated_category = db_session.get(Category, category.id)
    assert updated_category.name == "Updated"

def test_update_category_partial(client: TestClient, db_session: Session):
    category = Category(name="Original", description="Original description")
    db_session.add(category)
    db_session.commit()
    
    update_data = {"name": "Partial Update"}
    response = client.put(f"/categories/{category.id}", json=update_data)
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "Partial Update"
    assert response_data["description"] == "Original description"

def test_update_category_not_found(client: TestClient):
    update_data = {"name": "Updated"}
    response = client.put("/categories/999", json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not Found"

def test_delete_category(client: TestClient, db_session: Session):
    category = Category(name="Delete Test", description="Delete description")
    db_session.add(category)
    db_session.commit()
    
    response = client.delete(f"/categories/{category.id}")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["name"] == "Delete Test"
    
    # Verify deletion
    deleted_category = db_session.get(Category, category.id)
    assert deleted_category is None

def test_delete_category_not_found(client: TestClient):
    response = client.delete("/categories/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not Found"