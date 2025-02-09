
from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    name: str
    description: str
    category_id: int = Field(foreign_key="category.id")
    status: str

class Task(TaskBase, table=True):
    id: int| None = Field(default=None, primary_key=True)

class CreateTask(TaskBase):
    pass

class UpdateTask(TaskBase):
    name: str | None
    description: str | None
    category_id: int | None
    status: str | None

class DeleteTask(SQLModel):
    id: int

