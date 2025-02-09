from pydantic_settings import BaseSettings

#have to stude this settings api for now lets utilize dot -env

class Settings(BaseSettings):
    PROJECT_NAME: str = "task_maneger_fastapi"

    class Config:
        env_file = ".env"

settings = Settings()
