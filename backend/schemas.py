from pydantic import BaseModel


# Для садов
class GardenCreate(BaseModel):
    pass


class GardenResponse(BaseModel):
    pass


# Для вегетативных циклов
class VegetationCycleCreate(BaseModel):
    pass


# Для прогнозов
class PredictionResponse(BaseModel):
    pass


# Для job'ов
class JobResponse(BaseModel):
    pass