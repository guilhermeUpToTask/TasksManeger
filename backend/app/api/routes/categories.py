from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.models.category import Category,CreateCategory, UpdateCategory, DeleteCategory
from app.api.deps import SessionDep


router = APIRouter(prefix="/categories" , tags=["categories"])



@router.get(path='/',response_model=list[Category])
async def read_categories(session: SessionDep):
    statement = select(Category)
    print(statement)
    categories: list[Category] = session.exec(statement).all()

    return categories



@router.get(path='/{category_id}', response_model=Category)
async def read_category(category_id: int, session: SessionDep):
    category:Category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail='Category not Found')
    return category


@router.post(path='/', response_model=Category)
async def create_category(category_in: CreateCategory, session: SessionDep):
    category: Category = Category.model_validate(category_in)
    session.add(category)
    session.commit()
    session.refresh(category)

    return category

@router.put(path='/{category_id}', response_model=Category)
async def update_category(category_id: int, category_in: UpdateCategory, session: SessionDep):
    category:Category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail='Category not Found')
    
    update_dict = category_in.model_dump(exclude_unset=True)
    category.sqlmodel_update(update_dict)

    session.add(category)
    session.commit()
    session.refresh(category)

    return category


@router.delete(path='/{category_id}', response_model=Category)
async def delete_category(category_id:int, session: SessionDep):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail='Category not Found')
    
    session.delete(category)
    session.commit()
    
    return category