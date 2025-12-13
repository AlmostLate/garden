from database import Base


# Садовый квартал
class Garden(Base):
    __tablename__ = "gardens"


# Вегетативный цикл (ДАШАСЕТ)
class VegetationCycle(Base):
    __tablename__ = "vegetation_cycles"



# Прогноз урожая
class Prediction(Base):
    __tablename__ = "predictions"


# Job выполнения
class Job(Base):
    __tablename__ = "jobs"
