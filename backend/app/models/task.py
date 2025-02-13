
from sqlmodel import Field, SQLModel

class TaskBase(SQLModel):
    name: str
    description: str
    category_id: int = Field(foreign_key="category.id")
    status: str

class Task(TaskBase, table=True):
    __tablename__ = "task"
    id: int| None = Field(default=None, primary_key=True)

class CreateTask(TaskBase):
    pass

class UpdateTask(TaskBase):
    name: str | None = Field(default=None)
    description: str | None = Field(default=None)
    category_id: int | None = Field(default=None)
    status: str | None = Field(default=None)

class DeleteTask(SQLModel):
    id: int

