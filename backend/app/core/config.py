from pydantic import PostgresDsn
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import (
    AnyUrl,
    BeforeValidator,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator,
)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    PROJECT_NAME: str
    DATABASE_USERNAME : str
    DATABASE_PASSWORD: str
    DATABASE_HOST: str
    DATABASE_NAME: str
    DATABASE_PORT: int
    GOOGLE_API_KEY: str

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            username=self.DATABASE_USERNAME,
            password=self.DATABASE_PASSWORD,
            host=self.DATABASE_HOST,
            port=self.DATABASE_PORT,
            path=self.DATABASE_NAME,
        )

    #FRONTEND_HOST: str = "http://localhost:5173"
    #ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    #BACKEND_CORS_ORIGINS: Annotated[
    #    list[AnyUrl] | str, BeforeValidator(parse_cors)
    #] = []

    #@computed_field  # type: ignore[prop-decorator]
    #@property
    #def all_cors_origins(self) -> list[str]:
    #    return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
    #        self.FRONTEND_HOST
    #    ]    
    all_cors_origins: list[str] = ["*"]

settings = Settings()


