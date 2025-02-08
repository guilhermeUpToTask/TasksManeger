from sqlmodel import SQLModel, Field

class CategoryBase(SQLModel):
    name: str
    description: str

class Category(CategoryBase, table=True):
    id: int = Field(default=None, primary_key=True)

class CreateCategory(CategoryBase):
    pass

class UpdateCategory(CategoryBase):
    name: str | None
    description: str | None

class DeleteCategory(SQLModel):
    id: int
