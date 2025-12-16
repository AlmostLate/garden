from datetime import date
from sqlalchemy import func
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from backend.schemas import DashboardStats
from database import Base, engine, get_db
from models import Garden, Prediction, VegetationCycle

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Garden")


@app.get("/")
def main():
    return {"Hello": "World"}


@app.get("/gardens")
def get_gardens(db: Session = Depends(get_db)):
    return db.query(Garden).all()


@app.get("/gardens/{garden_id}/ndvi-history")
async def get_ndvi_history(
        garden_id: int,
        start_date: date,
        end_date: date,
        db: Session = Depends(get_db)
):
    cycles = db.query(VegetationCycle) \
        .filter(
        VegetationCycle.garden_id == garden_id,
        VegetationCycle.date >= start_date,
        VegetationCycle.date <= end_date
    ) \
        .order_by(VegetationCycle.date) \
        .all()

    return {
        "garden_id": garden_id,
        "data": [
            {
                "date": c.date,
                "ndvi": c.ndvi,
                "temperature": c.temperature_2m,
                "precipitation": c.precipitation
            }
            for c in cycles
        ]
    }


@app.get("/gardens/{garden_id}/dashboard_stat", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    # Общая статистика
    total_gardens = db.query(func.count(Garden.id)).scalar()
    total_area = db.query(func.sum(Garden.area_hectares)).scalar() or 0

    # Подсчет по зонам урожайности
    zones_count = db.query(
        Garden.productivity_zone,
        func.count(Garden.id)
    ).group_by(Garden.productivity_zone).all()

    zones_dict = dict(zones_dict={zone: count for zone, count in zones_count})
    avg_ndvi = db.query(func.avg(Garden.avg_ndvi)).scalar()
    active_alerts = db.query(func.count(Prediction.id)) \
                        .filter(Prediction.is_alert == True).scalar() or 0

    return DashboardStats(
        total_gardens=total_gardens,
        total_area=total_area,
        avg_ndvi=avg_ndvi,
        high_productivity_count=zones_dict.get('high', 0),
        medium_productivity_count=zones_dict.get('medium', 0),
        low_productivity_count=zones_dict.get('low', 0),
        active_alerts_count=active_alerts
    )
