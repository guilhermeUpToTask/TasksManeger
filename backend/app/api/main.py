from fastapi import APIRouter
from app.api.routes import categories, tasks

api_router = APIRouter()
api_router.include_router(categories.router)
api_router.include_router(tasks.router)


