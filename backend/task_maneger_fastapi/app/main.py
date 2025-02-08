from fastapi import FastAPI
from app.api import api_router
from app.core.config import settings
from starlette.middleware.cors import CORSMiddleware


app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(api_router)
app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
