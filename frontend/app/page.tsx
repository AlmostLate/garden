// app/page.tsx
import Link from 'next/link';
import {
    Satellite,
    BarChart3,
    Map,
    Cloud,
    Shield,
    Zap,
    Layers,
    TrendingUp,
    Eye
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-10"></div>
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            AI-карты садов{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                из космоса
              </span>
                        </h1>
                        <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                            Цифровой мониторинг плодовых насаждений на основе спутниковых данных и машинного обучения.
                            Принимайте обоснованные решения без постоянных выездов в поле.
                        </p>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <Link
                                href="/map"
                                className="group bg-white p-6 rounded-2xl border-2 border-green-200 hover:border-green-500 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Map className="w-10 h-10 text-green-700" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Интерактивная карта</h3>
                                    <p className="text-gray-600 text-sm">
                                        Просматривайте сады на карте с прогнозом урожайности по каждому участку
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard"
                                className="group bg-white p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-20 h-20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Layers className="w-10 h-10 text-blue-700" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Аналитический дашборд</h3>
                                    <p className="text-gray-600 text-sm">
                                        Статистика, графики и аналитика по всем садовым хозяйствам
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/demo"
                                className="group bg-white p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Eye className="w-10 h-10 text-purple-700" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Демо-версия</h3>
                                    <p className="text-gray-600 text-sm">
                                        Ознакомьтесь с возможностями системы на тестовых данных
                                    </p>
                                </div>
                            </Link>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                Получить доступ
                            </Link>
                            <Link
                                href="/features"
                                className="bg-white text-green-700 border-2 border-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-300"
                            >
                                Подробнее о возможностях
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Остальные секции остаются без изменений */}
            <ProblemSection />
            <FeaturesSection />
            <TechStackSection />
            <CTASection />
            <Footer />
        </div>
    );
}

function ProblemSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Проблема: время и деньги уходят в поле
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Традиционный мониторинг требует физического присутствия, что дорого и неэффективно
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-red-100 p-3 rounded-lg">
                                    <Shield className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Риски и потери</h3>
                                    <p className="text-gray-600">
                                        Упущенные возможности для раннего выявления проблем, снижение продуктивности, потери урожая
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <Zap className="w-8 h-8 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Нужно новое решение</h3>
                                    <p className="text-gray-600">
                                        Цифровой инструмент для автоматического анализа, выявления рисков и прогнозирования урожайности
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Исправленная секция "Наше решение" */}
                        <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-8 rounded-2xl border border-green-200 shadow-sm">
                            <h3 className="font-bold text-2xl text-gray-900 mb-6">Наше решение</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 font-medium">Объективные данные со спутников</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 font-medium">Масштабируемая технология</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 font-medium">Понятная визуализация для принятия решений</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 font-medium">Автоматический мониторинг 24/7</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-700 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 font-medium">Точные прогнозы урожайности</span>
                                </li>
                            </ul>

                            <div className="mt-6 pt-6 border-t border-green-300">
                                <div className="flex items-center gap-2 text-green-800">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-sm font-semibold">Экономия до 40% на мониторинге</span>
                                </div>
                                <div className="flex items-center gap-2 text-green-800 mt-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-sm font-semibold">Рост урожайности до 25%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


function FeaturesSection() {
    const features = [
        {
            icon: Map,
            title: 'Сегментация садов',
            description: 'Автоматическое выделение садовых кварталов с высокой точностью геолокации',
        },
        {
            icon: Satellite,
            title: 'Анализ состояния',
            description: 'Мониторинг здоровья деревьев через вегетационные индексы NDVI/EVI',
        },
        {
            icon: Cloud,
            title: 'Зоны риска',
            description: 'Раннее обнаружение болезней, стресса растений и деградации насаждений',
        },
        {
            icon: BarChart3,
            title: 'Прогноз урожайности',
            description: 'Предсказание объёмов урожая на следующий сезон на основе ML-моделей',
        },
    ];

    return (
        <section className="py-16 bg-gradient-to-b from-white to-green-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Основные возможности</h2>
                    <p className="text-gray-600 text-lg">Все результаты в реальном времени на интерактивной карте</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 hover:border-green-200"
                        >
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                                <feature.icon className="w-8 h-8 text-green-700" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TechStackSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Технологический стек</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="text-green-600 font-bold text-lg mb-2">Данные</div>
                            <p className="text-gray-600 text-sm">Sentinel-2, SRTM, NOAA</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="text-green-600 font-bold text-lg mb-2">ML/AI</div>
                            <p className="text-gray-600 text-sm">U-Net, Random Forest, LSTM</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="text-green-600 font-bold text-lg mb-2">ГИС</div>
                            <p className="text-gray-600 text-sm">GDAL, PostGIS, Mapbox</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="text-green-600 font-bold text-lg mb-2">Backend</div>
                            <p className="text-gray-600 text-sm">Python FastAPI, Node.js</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-4">Критерии качества</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-3xl font-bold">≥ 0.7</div>
                                <div className="text-sm opacity-90">IoU сегментации</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">≥ 0.6</div>
                                <div className="text-sm opacity-90">R² прогноза</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">100%</div>
                                <div className="text-sm opacity-90">Масштабируемость</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Готовы оптимизировать мониторинг садов?
                </h2>
                <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                    Начните использовать спутниковые данные и AI для повышения урожайности уже сегодня
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/map"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        Перейти к карте
                    </Link>
                    <Link
                        href="/dashboard"
                        className="bg-white text-blue-700 border-2 border-blue-600 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300"
                    >
                        Открыть дашборд
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} AI-карты садов из космоса. Все права защищены.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Решение для цифрового мониторинга плодовых насаждений
                    </p>
                </div>
            </div>
        </footer>
    );
}