from pydantic_settings import BaseSettings, SettingsConfigDict
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


