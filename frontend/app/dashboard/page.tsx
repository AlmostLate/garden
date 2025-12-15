// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    PieChart,
    Calendar,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    Droplets,
    Thermometer,
    Sun
} from 'lucide-react';

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(false);

    // Моковые данные для графиков
    const yieldData = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [
            {
                label: 'Урожайность (т/га)',
                data: [18, 22, 25, 28, 26, 24],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
            }
        ]
    };

    const productivityData = {
        labels: ['Высокая', 'Средняя', 'Низкая'],
        datasets: [
            {
                data: [45, 35, 20],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ]
            }
        ]
    };

    const healthIndices = [
        { name: 'NDVI', value: 0.72, change: 2.5, icon: Sun, color: 'text-green-700' },
        { name: 'EVI', value: 0.58, change: 1.2, icon: TrendingUp, color: 'text-blue-700' },
        { name: 'Влажность', value: 65, change: -3.1, icon: Droplets, unit: '%', color: 'text-blue-700' },
        { name: 'Температура', value: 19, change: 1.8, icon: Thermometer, unit: '°C', color: 'text-orange-700' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
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
                                Аналитический дашборд
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                                <Calendar className="w-4 h-4" />
                                Период
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium transition-colors">
                                <Download className="w-4 h-4" />
                                Экспорт отчета
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Периоды и фильтры */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {['week', 'month', 'quarter', 'year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        timeRange === range
                                            ? 'bg-green-700 text-white'
                                            : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {range === 'week' && 'Неделя'}
                                    {range === 'month' && 'Месяц'}
                                    {range === 'quarter' && 'Квартал'}
                                    {range === 'year' && 'Год'}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
                                <Filter className="w-4 h-4" />
                                Фильтры
                            </button>
                            <button
                                onClick={() => setLoading(true)}
                                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Обновить
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-700 font-medium">Средняя урожайность</h3>
                            <BarChart3 className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">24.3 т/га</div>
                        <div className="flex items-center text-green-700 font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">+2.4% к прошлому месяцу</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-700 font-medium">Общая площадь</h3>
                            <PieChart className="w-5 h-5 text-blue-700" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">125.4 га</div>
                        <div className="flex items-center text-green-700 font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">8 участков</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-700 font-medium">Рисковые зоны</h3>
                            <Thermometer className="w-5 h-5 text-red-700" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">15%</div>
                        <div className="flex items-center text-red-700 font-medium">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span className="text-sm">3 участка требуют внимания</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-700 font-medium">Точность прогноза</h3>
                            <Sun className="w-5 h-5 text-purple-700" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">82%</div>
                        <div className="flex items-center text-green-700 font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">+5% за последний месяц</span>
                        </div>
                    </div>
                </div>

                {/* Графики и показатели */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* График урожайности */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Динамика урожайности</h2>
                            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-800 bg-white">
                                <option>По месяцам</option>
                                <option>По кварталам</option>
                                <option>По годам</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="text-4xl mb-4 text-gray-600">📈</div>
                                <p className="text-gray-700 font-medium">Здесь будет график урожайности</p>
                                <p className="text-gray-600 text-sm mt-2">(Chart.js, Recharts или аналоги)</p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-700">
                            * Данные основаны на спутниковых снимках Sentinel-2 и ML-моделях
                        </div>
                    </div>

                    {/* Распределение продуктивности */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Распределение по продуктивности</h2>
                            <Link
                                href="/map"
                                className="text-green-700 hover:text-green-800 text-sm font-medium"
                            >
                                На карту →
                            </Link>
                        </div>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <div className="text-4xl mb-4 text-gray-600">🥧</div>
                                <p className="text-gray-700 font-medium">Здесь будет круговая диаграмма</p>
                                <p className="text-gray-600 text-sm mt-2">45% высокая, 35% средняя, 20% низкая</p>
                            </div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                <span className="text-sm text-gray-800">Высокая</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                                <span className="text-sm text-gray-800">Средняя</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                <span className="text-sm text-gray-800">Низкая</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Показатели здоровья */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Показатели здоровья растений</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {healthIndices.map((index, i) => (
                            <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <index.icon className={`w-4 h-4 ${index.color}`} />
                                        <span className="font-medium text-gray-800">{index.name}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${index.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {index.change >= 0 ? '+' : ''}{index.change}%
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {index.value}{index.unit || ''}
                                </div>
                                <div className="mt-2 h-2 bg-gray-300 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-700"
                                        style={{ width: `${Math.min(index.value * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Рекомендации и предупреждения */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Рекомендации</h2>
                        <div className="space-y-3">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-300 rounded-lg">
                                <div className="flex items-center gap-2 text-green-900 mb-1">
                                    <Sun className="w-4 h-4 text-green-700" />
                                    <span className="font-medium">Оптимизация полива</span>
                                </div>
                                <p className="text-sm text-green-800">
                                    Для участков 2 и 5 рекомендуется увеличить полив на 15% в утренние часы
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-300 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-900 mb-1">
                                    <Thermometer className="w-4 h-4 text-yellow-700" />
                                    <span className="font-medium">Контроль температуры</span>
                                </div>
                                <p className="text-sm text-yellow-800">
                                    Ожидается похолодание. Рекомендуется подготовить укрывной материал для участка 3
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-100 border border-blue-300 rounded-lg">
                                <div className="flex items-center gap-2 text-blue-900 mb-1">
                                    <Droplets className="w-4 h-4 text-blue-700" />
                                    <span className="font-medium">Внесение удобрений</span>
                                </div>
                                <p className="text-sm text-blue-800">
                                    Плановое внесение азотных удобрений для участков 1, 4, 7 в течение недели
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Предупреждения</h2>
                        <div className="space-y-3">
                            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-100 border border-red-300 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-red-900">Высокий риск</span>
                                    <span className="text-xs px-2 py-1 bg-red-200 text-red-900 rounded font-semibold">Срочно</span>
                                </div>
                                <p className="text-sm text-red-800 mb-2">
                                    Участок 3: обнаружены признаки заболевания. Рекомендуется немедленный осмотр.
                                </p>
                                <Link href="/map?garden=3" className="text-red-700 hover:text-red-900 text-sm font-medium inline-flex items-center gap-1">
                                    Перейти к участку
                                    <span className="ml-1">→</span>
                                </Link>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-100 border border-orange-300 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-orange-900">Средний риск</span>
                                    <span className="text-xs px-2 py-1 bg-orange-200 text-orange-900 rounded font-semibold">Внимание</span>
                                </div>
                                <p className="text-sm text-orange-800 mb-2">
                                    Участок 6: снижение индекса NDVI на 12%. Возможен дефицит питания.
                                </p>
                                <Link href="/map?garden=6" className="text-orange-700 hover:text-orange-900 text-sm font-medium inline-flex items-center gap-1">
                                    Перейти к участку
                                    <span className="ml-1">→</span>
                                </Link>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-300 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-blue-900">Низкий риск</span>
                                    <span className="text-xs px-2 py-1 bg-blue-200 text-blue-900 rounded font-semibold">Информация</span>
                                </div>
                                <p className="text-sm text-blue-800 mb-2">
                                    Участок 8: плановое обновление данных. Следующий мониторинг через 3 дня.
                                </p>
                                <Link href="/map?garden=8" className="text-blue-700 hover:text-blue-900 text-sm font-medium inline-flex items-center gap-1">
                                    Перейти к участку
                                    <span className="ml-1">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}