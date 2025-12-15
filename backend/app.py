from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Garden

# Base.metadata.create_all(bind=engine)
app = FastAPI(title="Garden")


@app.get("/")
def main():
    return {"Hello": "World"}
@app.get("/gardens")
def get_gardens(db: Session = Depends(get_db)):
    return db.query(Garden).all()
