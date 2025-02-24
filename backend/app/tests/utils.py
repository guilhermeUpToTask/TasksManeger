# Helper function to create a category (for testing tasks with category_id)
from sqlmodel import Session

from app.models.category import Category
from app.models.task import Task


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