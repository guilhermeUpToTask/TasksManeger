from fastapi import APIRouter, HTTPException
from models.task import Task, CreateTask, UpdateTask, DeleteTask

router = APIRouter(prefix="/tasks" , tags=["tasks"])


@router.get(path='/',response_model=list[Task])
async def read_tasks():
    return [{"name": "Task 1"}, {"name": "Task 2"}]


@router.get(path='/{task_id}', response_model=Task)
async def read_task(task_id: int):
    return {"name": "Task 1"}

@router.post(path='/', response_model=Task)
async def create_task(task: CreateTask):
    return task

@router.put(path='/{task_id}', response_model=Task)
async def update_task(task_id: int, task: UpdateTask):
    return task

@router.delete(path='/{task_id}', response_model=DeleteTask)
async def delete_task(task_id: int):
    return DeleteTask(id=task_id)

