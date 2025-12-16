"use client"
import React, { useState } from 'react';
import Link from "next/link";
import { Home, MapPin, Filter, AlertCircle, ZoomIn, ZoomOut, ChevronRight } from "lucide-react";

const Page = () => {
    const [showDetailed, setShowDetailed] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState(null);

    // Мок данные кластеров
    const clusters = [
        {
            id: 1,
            name: "Краснодарский край",
            coordinates: { x: 200, y: 300 },
            count: 45,
            area: "12 450 га",
            status: {
                normal: 38,
                warning: 5,
                problem: 2
            }
        },
        {
            id: 2,
            name: "Ростовская область",
            coordinates: { x: 400, y: 250 },
            count: 28,
            area: "8 120 га",
            status: {
                normal: 22,
                warning: 4,
                problem: 2
            }
        },
        {
            id: 3,
            name: "Крым",
            coordinates: { x: 150, y: 400 },
            count: 18,
            area: "5 300 га",
            status: {
                normal: 15,
                warning: 2,
                problem: 1
            }
        }
    ];

    // Мок данные для детальной карты (сады в кластере)
    const detailedGardens = [
        { id: 1, name: "Сад №12", status: "problem", ndvi: 0.38 },
        { id: 2, name: "Сад №7", status: "warning", ndvi: 0.52 },
        { id: 3, name: "Сад №5", status: "normal", ndvi: 0.72 },
        { id: 4, name: "Сад №23", status: "normal", ndvi: 0.68 },
    ];

    const getClusterSize = (count) => {
        if (count > 40) return 80;
        if (count > 20) return 60;
        return 40;
    };

    const getClusterColor = (cluster) => {
        const problemPercent = (cluster.status.problem / cluster.count) * 100;
        if (problemPercent > 10) return 'bg-red-500';
        if (problemPercent > 5) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Шапка */}
            <header className="pt-6 px-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    {/* Кнопка назад */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <div className="p-1.5 bg-emerald-100 group-hover:bg-emerald-500 rounded-md transition-colors duration-300">
                            <Home className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-emerald-700 transition-colors duration-300 text-sm">
                            На главную
                        </span>
                    </Link>

                    {/* Заголовок */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Карта садовых кластеров
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {showDetailed ? 'Детальная карта с выделенными участками' : 'Кластерный вид по регионам'}
                        </p>
                    </div>

                    {/* Кнопка детализации */}
                    <button
                        onClick={() => setShowDetailed(!showDetailed)}
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-0.5 text-gray-700"
                    >
                        {showDetailed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                        <span className="font-medium text-sm">
                            {showDetailed ? 'Свернуть' : 'Детализация'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Основной контент */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 px-6 py-4 overflow-hidden">
                {/* Карта */}
                <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg border border-gray-200 overflow-hidden min-h-0">
                    {/* Базовые элементы карты */}
                    <div className="absolute inset-0">
                        <div className="absolute w-full h-1 bg-blue-100 top-1/3"></div>
                        <div className="absolute w-1/2 h-1 bg-blue-100 bottom-1/4 left-1/4"></div>
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-100 rounded-full opacity-30"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-emerald-100 rounded-full opacity-30"></div>
                    </div>

                    {/* Кластеры */}
                    {!showDetailed && clusters.map(cluster => {
                        const size = getClusterSize(cluster.count);
                        const color = getClusterColor(cluster);

                        return (
                            <button
                                key={cluster.id}
                                onClick={() => setSelectedCluster(cluster)}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${color} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer border-4 border-white shadow-md`}
                                style={{
                                    left: `${cluster.coordinates.x}px`,
                                    top: `${cluster.coordinates.y}px`,
                                    width: `${size}px`,
                                    height: `${size}px`
                                }}
                            >
                                <MapPin className="w-5 h-5 text-white" />
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                                    {cluster.status.problem}
                                </div>
                            </button>
                        );
                    })}

                    {/* Детальная карта */}
                    {showDetailed && (
                        <div className="absolute inset-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {detailedGardens.map(garden => (
                                    <div
                                        key={garden.id}
                                        className={`group p-4 rounded-lg border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
                                            garden.status === 'problem' ? 'bg-red-50 border-red-200 hover:border-red-300' :
                                                garden.status === 'warning' ? 'bg-amber-50 border-amber-200 hover:border-amber-300' :
                                                    'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-gray-800">{garden.name}</h3>
                                            {garden.status === 'problem' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                        <div className="text-sm">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-600">NDVI:</span>
                                                <span className={`font-bold ${
                                                    garden.ndvi < 0.4 ? 'text-red-600' :
                                                        garden.ndvi < 0.6 ? 'text-amber-600' :
                                                            'text-emerald-600'
                                                }`}>
                                                    {garden.ndvi}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Статус:</span>
                                                <span className={`font-bold ${
                                                    garden.status === 'problem' ? 'text-red-600' :
                                                        garden.status === 'warning' ? 'text-amber-600' :
                                                            'text-emerald-600'
                                                }`}>
                                                    {garden.status === 'problem' ? 'Проблема' :
                                                        garden.status === 'warning' ? 'Внимание' : 'Норма'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3 flex justify-end">
                                            <ChevronRight className="w-4 h-4 text-emerald-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Панель с легендой */}
                <div className="lg:w-80 flex flex-col gap-4 min-h-0">
                    {/* Легенда */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5 flex-1 overflow-auto">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                            <div className="p-1.5 bg-emerald-100 rounded-md">
                                <Filter className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="font-semibold text-gray-800">Легенда кластеров</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Цвет кластера:</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">Низкий риск</div>
                                            <div className="text-xs text-gray-500">≤ 5% проблемных</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-amber-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">Средний риск</div>
                                            <div className="text-xs text-gray-500">5-10% проблемных</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">Высокий риск</div>
                                            <div className="text-xs text-gray-500">≥ 10% проблемных</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Размер кластера:</h4>
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full mb-2 border border-emerald-200"></div>
                                        <div className="text-xs text-gray-700">Малый</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-emerald-200 rounded-full mb-2 border border-emerald-300"></div>
                                        <div className="text-xs text-gray-700">Средний</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 bg-emerald-300 rounded-full mb-2 border border-emerald-400"></div>
                                        <div className="text-xs text-gray-700">Большой</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center border border-amber-600">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-white shadow-sm">
                                            <span className="text-[10px] font-bold text-white">2</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">Индикатор проблем</div>
                                        <div className="text-xs text-gray-500">Количество проблемных участков</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Информация */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <div className="text-sm font-medium text-emerald-700">Информация</div>
                        </div>
                        <ul className="text-xs text-emerald-600 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2 text-emerald-500">•</span>
                                <span>Данные Sentinel-2</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-emerald-500">•</span>
                                <span>Автоматическое выделение</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-emerald-500">•</span>
                                <span>Обновление: каждые 3 дня</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-emerald-500">•</span>
                                <span>Разрешение: 10 метров</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Панель статистики */}
            {selectedCluster && !showDetailed && (
                <div className="fixed inset-x-4 bottom-4 bg-white rounded-lg border border-gray-300 shadow-lg p-5 z-10 max-w-md mx-auto">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{selectedCluster.name}</h2>
                            <p className="text-gray-500 text-sm">Статистика по кластеру</p>
                        </div>
                        <button
                            onClick={() => setSelectedCluster(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-emerald-50 rounded border border-emerald-100">
                            <div className="text-xl font-bold text-emerald-700">{selectedCluster.count}</div>
                            <div className="text-xs text-gray-700">Всего</div>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded border border-amber-100">
                            <div className="text-xl font-bold text-amber-700">{selectedCluster.status.warning}</div>
                            <div className="text-xs text-gray-700">Внимание</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded border border-red-100">
                            <div className="text-xl font-bold text-red-700">{selectedCluster.status.problem}</div>
                            <div className="text-xs text-gray-700">Проблемы</div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2 mb-3">
                            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-gray-800">Проблемные зоны</h4>
                                <div className="text-xs text-gray-600 mt-1">
                                    {selectedCluster.status.problem} проблемных участков ({Math.round((selectedCluster.status.problem / selectedCluster.count) * 100)}%)
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowDetailed(true);
                                setSelectedCluster(null);
                            }}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors duration-300 text-sm"
                        >
                            Показать детальную карту
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;