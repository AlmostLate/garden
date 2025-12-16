import datetime
from sqlalchemy import Integer, Column, String, JSON, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from database import Base



class Garden(Base):
    __tablename__ = "gardens"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    area_hectares = Column(Integer)
    polygon = Column(JSON)
    location = Column(String)
    crop_type = Column(String)
    planting_year = Column(Integer)

    soil_texture_usda_code = Column(Integer)
    soil_texture_depth = Column(String)

    avg_ndvi = Column(Float)
    productivity_zone = Column(String)
    risk_score = Column(Float)

    created_at = Column(DateTime, default=datetime.datetime.now())
    updated_at = Column(DateTime, default=datetime.datetime.now(), onupdate=datetime.datetime.now())

    vegetation_cycles = relationship("VegetationCycle", back_populates="garden")
    predictions = relationship("Prediction", back_populates="garden")


class VegetationCycle(Base):
    __tablename__ = "vegetation_cycles"
    id = Column(Integer, primary_key=True, index=True)
    garden_id = Column(Integer, ForeignKey("gardens.id"), index=True)
    date = None

    ndvi = Column(Float)
    evi = Column(Float)
    ndwi = Column(Float)

    temperature_2m = Column(Float)
    soil_moisture_10cm = Column(Float)
    soil_moisture_30cm = Column(Float)
    precipitation = Column(Float)
    solar_radiation = Column(Float)

    gdd = Column(Float)
    water_deficit = Column(Float)

    is_peak_vegetation = Column(Boolean, default=False)
    is_stress_period = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.now())

    garden = relationship("Garden", back_populates="vegetation_cycles")


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    garden_id = Column(Integer, ForeignKey("gardens.id"), index=True)
    prediction_date = Column(DateTime, default=datetime.datetime.now())
    forecast_date = Column(DateTime)

    yield_forecast = Column(Float)
    yield_forecast_lower = Column(Float)
    yield_forecast_upper = Column(Float)

    confidence_score = Column(Float)
    model_version = Column(String)
    r_squared = Column(Float)

    factors = Column(JSON)

    status = Column(String, default="active")
    is_alert = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.now())

    garden = relationship("Garden", back_populates="predictions")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String, index=True)
    status = Column(String, default="active")

    created_at = Column(DateTime, default=datetime.datetime.now())

