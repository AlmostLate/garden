from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base



# Подключение к Postgres
engine = create_engine("postgresql://agro_user:agro_pass@localhost:5432/agro_db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()