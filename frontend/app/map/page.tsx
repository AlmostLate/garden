// app/map/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MapPin,
    ChevronLeft,
    Filter,
    Download,
    RefreshCw,
    BarChart3,
    Thermometer,
    Droplets,
    Sun,
    AlertTriangle,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

// Типы для полигонов
interface GardenPolygon {
    id: string;
    name: string;
    area: number; // га
    cropType: string;
    productivity: 'high' | 'medium' | 'low';
    forecast: {
        yield: number; // тонн/га
        confidence: number; // 0-100%
        riskLevel: 'low' | 'medium' | 'high';
    };
    healthIndices: {
        ndvi: number;
        evi: number;
        moisture: number;
        temperature: number;
    };
    coordinates: [number, number][]; // для упрощения - только центр
}

export default function MapPage() {
    const [selectedPolygon, setSelectedPolygon] = useState<GardenPolygon | null>(null);
    const [polygons, setPolygons] = useState<GardenPolygon[]>([]);
    const [loading, setLoading] = useState(true);

    // Загрузка данных полигонов
    useEffect(() => {
        // Здесь будет реальный API-запрос
        setTimeout(() => {
            setPolygons(mockPolygons);
            setLoading(false);
        }, 1000);
    }, []);

    const handlePolygonClick = (polygon: GardenPolygon) => {
        setSelectedPolygon(polygon);
    };

    const getProductivityColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-green-600';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low': return 'text-green-700';
            case 'medium': return 'text-yellow-700';
            case 'high': return 'text-red-700';
            default: return 'text-gray-700';
        }
    };

    const getRiskBgColor = (level: string) => {
        switch (level) {
            case 'low': return 'bg-green-100';
            case 'medium': return 'bg-yellow-100';
            case 'high': return 'bg-red-100';
            default: return 'bg-gray-100';
        }
    };

    const getRiskIcon = (level: string) => {
        switch (level) {
            case 'low': return <CheckCircle className="w-4 h-4 text-green-700" />;
            case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-700" />;
            case 'high': return <AlertTriangle className="w-4 h-4 text-red-700" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                На главную
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Интерактивная карта садов
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                                <Filter className="w-4 h-4" />
                                Фильтры
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                                <Download className="w-4 h-4" />
                                Экспорт
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Левая панель - список полигонов */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg text-gray-900">Садовые участки</h2>
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-700">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {polygons.map((polygon) => (
                                    <button
                                        key={polygon.id}
                                        onClick={() => handlePolygonClick(polygon)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                                            selectedPolygon?.id === polygon.id
                                                ? 'border-green-600 bg-green-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-600" />
                                                <span className="font-medium text-gray-900">{polygon.name}</span>
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${getProductivityColor(polygon.productivity)}`}></div>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {polygon.area} га • {polygon.cropType}
                                        </div>
                                        <div className="text-sm font-medium mt-1 text-gray-900">
                                            Прогноз: {polygon.forecast.yield} т/га
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Легенда */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h3 className="font-medium mb-3 text-gray-900">Легенда продуктивности</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                                        <span className="text-sm text-gray-800">Высокая продуктивность</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                                        <span className="text-sm text-gray-800">Средняя продуктивность</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                                        <span className="text-sm text-gray-800">Низкая продуктивность</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Основная карта */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Заглушка для карты */}
                            <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50">
                                {/* Здесь будет встроена реальная карта (Leaflet, Mapbox, Google Maps) */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
                                        <div className="text-4xl mb-4 text-gray-600">🗺️</div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Интерактивная карта садов
                                        </h3>
                                        <p className="text-gray-700">
                                            Здесь будет отображение полигонов садов с цветовой кодировкой
                                        </p>
                                        <p className="text-gray-600 text-sm mt-2">
                                            (Используется Mapbox/Leaflet с векторными слоями)
                                        </p>
                                    </div>
                                </div>

                                {/* Пример полигонов на карте */}
                                {polygons.map((polygon, index) => {
                                    const left = 20 + (index * 15) % 70;
                                    const top = 30 + (index * 10) % 60;

                                    return (
                                        <button
                                            key={polygon.id}
                                            onClick={() => handlePolygonClick(polygon)}
                                            className={`absolute w-24 h-24 rounded-lg border-4 transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 hover:shadow-lg ${
                                                selectedPolygon?.id === polygon.id
                                                    ? 'border-blue-600 shadow-xl'
                                                    : getProductivityColor(polygon.productivity).replace('bg-', 'border-')
                                            }`}
                                            style={{ left: `${left}%`, top: `${top}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                                <span className="font-bold text-sm text-gray-900">{polygon.name}</span>
                                                <span className="text-xs text-gray-700 mt-1">{polygon.area} га</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Статус бар карты */}
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Показано <span className="font-semibold">{polygons.length}</span> садовых участков
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-700">Масштаб: <span className="font-medium">1:50,000</span></span>
                                        <span className="text-gray-700">Координаты: <span className="font-medium">45.0° N, 34.0° E</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая панель - детали выбранного полигона */}
                    <div className="lg:col-span-1">
                        {selectedPolygon ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-lg text-gray-900">Детали участка</h2>
                                    <button
                                        onClick={() => setSelectedPolygon(null)}
                                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Основная информация */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 text-lg">{selectedPolygon.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-700">
                                            <span className="bg-gray-100 px-2 py-1 rounded"><span className="font-medium">{selectedPolygon.area} га</span></span>
                                            <span className="bg-gray-100 px-2 py-1 rounded"><span className="font-medium">{selectedPolygon.cropType}</span></span>
                                        </div>
                                    </div>

                                    {/* Прогноз урожайности */}
                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2 mb-3">
                                            <BarChart3 className="w-5 h-5 text-blue-700" />
                                            <h4 className="font-bold text-blue-900">Прогноз урожайности</h4>
                                        </div>
                                        <div className="mb-3">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm text-gray-800">Ожидаемый урожай</span>
                                                <span className="font-bold text-gray-900">{selectedPolygon.forecast.yield} т/га</span>
                                            </div>
                                            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                                                    style={{ width: `${Math.min(selectedPolygon.forecast.yield * 4, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-800">
                                            <span>Уверенность прогноза:</span>
                                            <span className="font-semibold">{selectedPolygon.forecast.confidence}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2 text-gray-800">
                                            <span>Уровень риска:</span>
                                            <span className={`font-semibold flex items-center gap-1 ${getRiskColor(selectedPolygon.forecast.riskLevel)}`}>
                                                {getRiskIcon(selectedPolygon.forecast.riskLevel)}
                                                {selectedPolygon.forecast.riskLevel === 'high' ? 'Высокий' :
                                                    selectedPolygon.forecast.riskLevel === 'medium' ? 'Средний' : 'Низкий'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Показатели здоровья */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Показатели здоровья</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Sun className="w-4 h-4 text-green-700" />
                                                    <span className="text-sm font-semibold text-gray-800">NDVI</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{selectedPolygon.healthIndices.ndvi.toFixed(3)}</div>
                                                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-600" style={{ width: `${selectedPolygon.healthIndices.ndvi * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Thermometer className="w-4 h-4 text-blue-700" />
                                                    <span className="text-sm font-semibold text-gray-800">EVI</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{selectedPolygon.healthIndices.evi.toFixed(3)}</div>
                                                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600" style={{ width: `${selectedPolygon.healthIndices.evi * 100}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Droplets className="w-4 h-4 text-blue-700" />
                                                    <span className="text-sm font-semibold text-gray-800">Влажность</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{selectedPolygon.healthIndices.moisture}%</div>
                                                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600" style={{ width: `${selectedPolygon.healthIndices.moisture}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Thermometer className="w-4 h-4 text-orange-700" />
                                                    <span className="text-sm font-semibold text-gray-800">Температура</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">{selectedPolygon.healthIndices.temperature}°C</div>
                                                <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-600" style={{ width: `${selectedPolygon.healthIndices.temperature * 5}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Рекомендации */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <h4 className="font-semibold text-gray-900 mb-2">Рекомендации</h4>
                                        {selectedPolygon.forecast.riskLevel === 'high' ? (
                                            <div className={`p-3 rounded-lg border ${getRiskBgColor(selectedPolygon.forecast.riskLevel)} border-red-200`}>
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-800 mb-1">Требуется срочный осмотр</p>
                                                        <p className="text-sm text-red-700">
                                                            Выявлены признаки стресса растений. Рекомендуется немедленный осмотр специалиста и обработка растений.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : selectedPolygon.forecast.riskLevel === 'medium' ? (
                                            <div className={`p-3 rounded-lg border ${getRiskBgColor(selectedPolygon.forecast.riskLevel)} border-yellow-200`}>
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-yellow-800 mb-1">Требуется внимание</p>
                                                        <p className="text-sm text-yellow-700">
                                                            Рекомендуется дополнительный полив и контроль состояния. Проверьте уровень увлажнения почвы.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`p-3 rounded-lg border ${getRiskBgColor(selectedPolygon.forecast.riskLevel)} border-green-200`}>
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800 mb-1">Состояние удовлетворительное</p>
                                                        <p className="text-sm text-green-700">
                                                            Продолжайте текущий уход. Рекомендуется плановый мониторинг через 2 недели.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Действия */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-sm">
                                                Сохранить отчет
                                            </button>
                                            <Link
                                                href={`/dashboard?garden=${selectedPolygon.id}`}
                                                className="flex-1 py-2.5 border border-blue-600 text-blue-700 rounded-lg hover:bg-blue-50 text-center transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                                Аналитика
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                                <div className="text-3xl mb-4 text-gray-600">🗺️</div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">Выберите участок</h3>
                                <p className="text-gray-700">
                                    Кликните на полигон на карте или выберите участок из списка слева, чтобы увидеть детальную информацию
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Моковые данные
const mockPolygons: GardenPolygon[] = [
    {
        id: '1',
        name: 'Сад №1',
        area: 12.5,
        cropType: 'Яблони',
        productivity: 'high',
        forecast: {
            yield: 25.4,
            confidence: 85,
            riskLevel: 'low'
        },
        healthIndices: {
            ndvi: 0.78,
            evi: 0.65,
            moisture: 72,
            temperature: 18
        },
        coordinates: [[45.1, 34.1]]
    },
    {
        id: '2',
        name: 'Сад №2',
        area: 8.3,
        cropType: 'Груши',
        productivity: 'medium',
        forecast: {
            yield: 18.2,
            confidence: 72,
            riskLevel: 'medium'
        },
        healthIndices: {
            ndvi: 0.62,
            evi: 0.52,
            moisture: 58,
            temperature: 20
        },
        coordinates: [[45.2, 34.2]]
    },
    {
        id: '3',
        name: 'Сад №3',
        area: 15.7,
        cropType: 'Вишни',
        productivity: 'low',
        forecast: {
            yield: 12.8,
            confidence: 68,
            riskLevel: 'high'
        },
        healthIndices: {
            ndvi: 0.45,
            evi: 0.38,
            moisture: 45,
            temperature: 22
        },
        coordinates: [[45.3, 34.3]]
    },
    {
        id: '4',
        name: 'Сад №4',
        area: 10.2,
        cropType: 'Сливы',
        productivity: 'high',
        forecast: {
            yield: 22.1,
            confidence: 79,
            riskLevel: 'low'
        },
        healthIndices: {
            ndvi: 0.71,
            evi: 0.61,
            moisture: 68,
            temperature: 19
        },
        coordinates: [[45.4, 34.4]]
    },
];