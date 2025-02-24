From a fastapi backend route {from fastapi import APIRouter, HTTPException

from sqlmodel import select

from app.models.task import Task, CreateTask, UpdateTask, DeleteTask

from app.models.category import Category

from app.api.deps import SessionDep

  

router = APIRouter(prefix="/tasks" , tags=["tasks"])

  
  
  

@router.get(path='/',response_model=list[Task])

async def read_tasks(session: SessionDep):

statement = select(Task)

tasks: list[Task] = session.exec(statement).all()

return tasks

  
  

@router.get(path='/{task_id}', response_model=Task)

async def read_task(task_id: int, session:SessionDep):

task: Task = session.get(Task, task_id)

  

if task is None:

raise HTTPException(status_code=404, detail="Task Not Found")

  

return task

  

@router.post(path='/', response_model=Task)

async def create_task(task_in: CreateTask, session:SessionDep):

if task_in.category_id is not None:

statement = select(Category).where(Category.id == task_in.category_id)

category = session.exec(statement).first()

if category is None:

raise HTTPException(status_code=404, detail="Category not Found")

  
  

task = Task.model_validate(task_in)

  

session.add(task)

session.commit()

session.refresh(task)

return task

  

@router.put(path='/{task_id}', response_model=Task)

async def update_task(task_id: int, task_in: UpdateTask, session:SessionDep):

task = session.get(Task, task_id)

if not task:

raise HTTPException(status_code=404, detail="Task Not Found")

if task_in.category_id is not None:

statement = select(Category).where(Category.id == task_in.category_id)

category = session.exec(statement).first()

if category is None:

raise HTTPException(status_code=404, detail="Category not Found")

  

update_dict = task_in.model_dump(exclude_unset=True)

task.sqlmodel_update(update_dict)

  

session.add(task)

session.commit()

session.refresh(task)

return task

  

@router.delete(path='/{task_id}', response_model=Task)

async def delete_task(task_id: int, session:SessionDep):

task = session.get(Task, task_id)

if not task:

raise HTTPException(status_code=404, detail="Task Not Found")

session.delete(task)

session.commit()

  
  

return task} with has this sqlmodel {from fastapi import APIRouter, HTTPException

from sqlmodel import select

from app.models.task import Task, CreateTask, UpdateTask, DeleteTask

from app.models.category import Category

from app.api.deps import SessionDep

  

router = APIRouter(prefix="/tasks" , tags=["tasks"])

  
  
  

@router.get(path='/',response_model=list[Task])

async def read_tasks(session: SessionDep):

statement = select(Task)

tasks: list[Task] = session.exec(statement).all()

return tasks

  
  

@router.get(path='/{task_id}', response_model=Task)

async def read_task(task_id: int, session:SessionDep):

task: Task = session.get(Task, task_id)

  

if task is None:

raise HTTPException(status_code=404, detail="Task Not Found")

  

return task

  

@router.post(path='/', response_model=Task)

async def create_task(task_in: CreateTask, session:SessionDep):

if task_in.category_id is not None:

statement = select(Category).where(Category.id == task_in.category_id)

category = session.exec(statement).first()

if category is None:

raise HTTPException(status_code=404, detail="Category not Found")

  
  

task = Task.model_validate(task_in)

  

session.add(task)

session.commit()

session.refresh(task)

return task

  

@router.put(path='/{task_id}', response_model=Task)

async def update_task(task_id: int, task_in: UpdateTask, session:SessionDep):

task = session.get(Task, task_id)

if not task:

raise HTTPException(status_code=404, detail="Task Not Found")

if task_in.category_id is not None:

statement = select(Category).where(Category.id == task_in.category_id)

category = session.exec(statement).first()

if category is None:

raise HTTPException(status_code=404, detail="Category not Found")

  

update_dict = task_in.model_dump(exclude_unset=True)

task.sqlmodel_update(update_dict)

  

session.add(task)

session.commit()

session.refresh(task)

return task

  

@router.delete(path='/{task_id}', response_model=Task)

async def delete_task(task_id: int, session:SessionDep):

task = session.get(Task, task_id)

if not task:

raise HTTPException(status_code=404, detail="Task Not Found")

session.delete(task)

session.commit()

  
  

return task} generate the necessaries tests using pytest.