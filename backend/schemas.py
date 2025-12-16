from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class ProductivityZone(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SoilTextureUSDACode(int, Enum):
    SAND = 1
    LOAMY_SAND = 2
    SANDY_LOAM = 3
    LOAM = 4
    SILT_LOAM = 5
    SILT = 6
    SANDY_CLAY = 7
    CLAY_LOAM = 8
    SILTY_CLAY = 9
    SANDY_CLAY_ALT = 10
    SILTY_CLAY_ALT = 11
    CLAY = 12


class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    ACTIVE = "active"


class PredictionStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    OVERRIDDEN = "overridden"


class GeometryModel(BaseModel):
    """Модель для геометрии GeoJSON"""
    type: str
    coordinates: List


class GardenCreate(BaseModel):
    """Схема для создания сада"""
    name: str = Field(..., min_length=1, max_length=100)
    polygon: GeometryModel
    location: str = Field(..., max_length=200)
    crop_type: str = Field(..., max_length=50)
    planting_year: int = Field(..., ge=1900, le=datetime.now().year)
    soil_texture_usda_code: Optional[int] = Field(None, ge=1, le=12)
    soil_texture_depth: Optional[str] = Field(None, max_length=10)

    @field_validator('polygon')
    @classmethod
    def validate_polygon(cls, v: GeometryModel) -> GeometryModel:
        if v.type not in ['Polygon', 'MultiPolygon']:
            raise ValueError('Polygon must be of type Polygon or MultiPolygon')
        return v


class GardenUpdate(BaseModel):
    """Схема для обновления сада"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    avg_ndvi: Optional[float] = Field(None, ge=0, le=1)
    productivity_zone: Optional[ProductivityZone] = None
    risk_score: Optional[float] = Field(None, ge=0, le=1)
    soil_texture_usda_code: Optional[int] = Field(None, ge=1, le=12)


class GardenResponse(BaseModel):
    """Схема для ответа с данными сада"""
    id: int
    name: str
    polygon: Dict[str, Any]
    location: str
    crop_type: str
    planting_year: int
    soil_texture_usda_code: Optional[int] = None
    soil_texture_depth: Optional[str] = None
    avg_ndvi: Optional[float] = None
    productivity_zone: Optional[str] = None
    risk_score: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    soil_texture_name: Optional[str] = None
    soil_drainage_class: Optional[str] = None
    is_well_drained: Optional[bool] = None

    vegetation_cycle_count: Optional[int] = 0
    last_prediction: Optional[float] = None
    last_prediction_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class VegetationCycleCreate(BaseModel):
    """Схема для создания записи вегетативного цикла"""
    garden_id: int
    ndvi: float = Field(..., ge=-1, le=1)
    evi: Optional[float] = Field(None, ge=-1, le=1)
    ndwi: Optional[float] = Field(None, ge=-1, le=1)
    temperature_2m: Optional[float] = None  # в °C
    soil_moisture_10cm: Optional[float] = Field(None, ge=0, le=1)
    soil_moisture_30cm: Optional[float] = Field(None, ge=0, le=1)
    precipitation: Optional[float] = Field(None, ge=0)
    solar_radiation: Optional[float] = Field(None, ge=0)
    gdd: Optional[float] = Field(None, ge=0)
    water_deficit: Optional[float] = None
    is_peak_vegetation: bool = False
    is_stress_period: bool = False

    date: Optional[date] = None

    @field_validator('date', mode='before')
    @classmethod
    def set_date_if_none(cls, v: Optional[date]):
        if v is None:
            return datetime.now().date()
        return v


class VegetationCycleUpdate(BaseModel):
    """Схема для обновления записи вегетативного цикла"""
    ndvi: Optional[float] = Field(None, ge=-1, le=1)
    evi: Optional[float] = Field(None, ge=-1, le=1)
    ndwi: Optional[float] = Field(None, ge=-1, le=1)
    is_peak_vegetation: Optional[bool] = None
    is_stress_period: Optional[bool] = None


class VegetationCycleResponse(BaseModel):
    """Схема для ответа с данными вегетативного цикла"""
    id: int
    garden_id: int
    date: date
    ndvi: float
    evi: Optional[float] = None
    ndwi: Optional[float] = None
    temperature_2m: Optional[float] = None
    soil_moisture_10cm: Optional[float] = None
    soil_moisture_30cm: Optional[float] = None
    precipitation: Optional[float] = None
    solar_radiation: Optional[float] = None
    gdd: Optional[float] = None
    water_deficit: Optional[float] = None
    is_peak_vegetation: bool
    is_stress_period: bool
    created_at: datetime

    garden_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PredictionCreate(BaseModel):
    """Схема для создания прогноза"""
    garden_id: int
    forecast_date: date
    yield_forecast: float = Field(..., ge=0)  # т/га
    yield_forecast_lower: Optional[float] = Field(None, ge=0)
    yield_forecast_upper: Optional[float] = Field(None, ge=0)
    confidence_score: float = Field(..., ge=0, le=1)
    model_version: str = Field(..., max_length=20)
    r_squared: Optional[float] = Field(None, ge=0, le=1)
    factors: Optional[Dict[str, float]] = None
    is_alert: bool = False


class PredictionUpdate(BaseModel):
    """Схема для обновления прогноза"""
    status: Optional[PredictionStatus] = None
    is_alert: Optional[bool] = None
    yield_forecast: Optional[float] = Field(None, ge=0)


class PredictionResponse(BaseModel):
    """Схема для ответа с данными прогноза"""
    id: int
    garden_id: int
    prediction_date: datetime
    forecast_date: date
    yield_forecast: float
    yield_forecast_lower: Optional[float] = None
    yield_forecast_upper: Optional[float] = None
    confidence_score: float
    model_version: str
    r_squared: Optional[float] = None
    factors: Optional[Dict[str, float]] = None
    status: str
    is_alert: bool
    created_at: datetime

    # Связанные данные
    garden_name: Optional[str] = None
    garden_crop_type: Optional[str] = None
    garden_area: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class JobCreate(BaseModel):
    """Схема для создания job"""
    job_type: str = Field(..., max_length=50)
    status: JobStatus = JobStatus.PENDING


class JobUpdate(BaseModel):
    """Схема для обновления job"""
    status: Optional[JobStatus] = None


class JobResponse(BaseModel):
    """Схема для ответа с данными job"""
    id: int
    job_type: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardStats(BaseModel):
    """Статистика для дашборда"""
    total_gardens: int
    total_area: float
    avg_ndvi: Optional[float] = None
    avg_yield_forecast: Optional[float] = None
    high_productivity_count: int = 0
    medium_productivity_count: int = 0
    low_productivity_count: int = 0
    problem_zones_percentage: float = 0.0
    active_alerts_count: int = 0
    recent_vegetation_updates: int = 0


class GardenMapMarker(BaseModel):
    """Упрощенные данные сада для карты"""
    id: int
    name: str
    polygon: Dict[str, Any]
    centroid: Optional[Dict[str, Any]] = None
    crop_type: str
    productivity_zone: Optional[str] = None
    risk_score: Optional[float] = None
    current_ndvi: Optional[float] = None
    yield_forecast: Optional[float] = None
    has_alert: bool = False


class BatchVegetationCycleCreate(BaseModel):
    """Пакетное создание записей вегетативных циклов"""
    garden_id: int
    data: List[Dict[str, Any]]  # Список словарей с данными для каждой даты


class BatchPredictionCreate(BaseModel):
    """Пакетное создание прогнозов"""
    garden_ids: List[int]
    forecast_date: date
    model_version: str


class SoilTextureInfo(BaseModel):
    """Информация о типе почвы"""
    code: int
    name: str
    description: str
    drainage_class: str
    suitability_for_fruit_trees: str


class YieldForecastFactors(BaseModel):
    """Факторы, влияющие на прогноз урожайности"""
    soil_quality: float = Field(..., ge=0, le=1)
    weather_conditions: float = Field(..., ge=0, le=1)
    vegetation_health: float = Field(..., ge=0, le=1)
    historical_yield: float = Field(..., ge=0, le=1)
    management_practices: Optional[float] = Field(None, ge=0, le=1)


class PaginatedResponse(BaseModel):
    """Обертка для пагинированных ответов"""
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int


class SuccessResponse(BaseModel):
    """Успешный ответ"""
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


class ErrorResponse(BaseModel):
    """Ответ с ошибкой"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None


class GardenFilter(BaseModel):
    """Фильтр для поиска садов"""
    crop_type: Optional[str] = None
    productivity_zone: Optional[ProductivityZone] = None
    min_ndvi: Optional[float] = Field(None, ge=0, le=1)
    max_risk_score: Optional[float] = Field(None, ge=0, le=1)
    planting_year_from: Optional[int] = Field(None, ge=1900)
    planting_year_to: Optional[int] = Field(None, le=datetime.now().year)


class DateRangeFilter(BaseModel):
    """Фильтр по диапазону дат"""
    start_date: date
    end_date: date

    @field_validator('end_date')
    @classmethod
    def validate_date_range(cls, end_date: date, info) -> date:
        if 'start_date' in info.data and end_date < info.data['start_date']:
            raise ValueError('End date must be after start date')
        return end_date


class Validators:
    """Методы для валидации"""

    @staticmethod
    def validate_soil_texture_code(code: int) -> bool:
        """Проверка корректности кода текстуры почвы"""
        return 1 <= code <= 12

    @staticmethod
    def get_soil_texture_name(code: int) -> str:
        """Получить название типа почвы по коду USDA"""
        texture_names = {
            1: "Песок",
            2: "Супесь",
            3: "Супесчаный суглинок",
            4: "Суглинок",
            5: "Пылеватый суглинок",
            6: "Пылеватая почва",
            7: "Супесчаная глина",
            8: "Глинистый суглинок",
            9: "Пылеватая глина",
            10: "Супесчаная глина (альт.)",
            11: "Пылеватая глина (альт.)",
            12: "Глина"
        }
        return texture_names.get(code, "Неизвестный тип")

    @staticmethod
    def get_drainage_class(code: int) -> str:
        """Определить класс дренажа по типу почвы"""
        if code in [1, 2, 3, 4]:
            return "хороший"
        elif code in [5, 6]:
            return "умеренный"
        else:
            return "плохой"

