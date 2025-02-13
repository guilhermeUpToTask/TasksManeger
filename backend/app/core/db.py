from sqlmodel import Field, SQLModel, create_engine, Session
from sqlalchemy.engine import URL
##need to import all models to proper create tables in db
from app.models import category, task
from app.core.config import settings


## Should be using settings package, latter on we will learn how to use it


url_object = URL.create(
    "postgresql+psycopg2",
    username=settings.DATABASE_USERNAME,
    password=settings.DATABASE_PASSWORD, 
    host=settings.DATABASE_HOST,
    database=settings.DATABASE_NAME,
)


engine = create_engine(url_object, echo=True)


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

