from fastapi import APIRouter
from app.api.routes import categories, tasks
from app.api.routes.rag import rag_chat

api_router = APIRouter()
api_router.include_router(categories.router)
api_router.include_router(tasks.router)
api_router.include_router(rag_chat.router)


