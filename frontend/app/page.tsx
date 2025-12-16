import React from 'react';
import { Map, BarChart3, FileText, TrendingUp, ChevronRight } from "lucide-react";

const Page = () => {
    const actionCards = [
        {
            id: 1,
            title: "Карта садов",
            icon: Map,
            description: "Интерактивная карта с зонированием садовых участков",
            color: "bg-gradient-to-br from-green-500 to-emerald-600",
            href: "/map"
        },
        {
            id: 2,
            title: "Аналитика",
            icon: BarChart3,
            description: "Графики NDVI/EVI и анализ состояния",
            color: "bg-gradient-to-br from-blue-500 to-cyan-600",
            href: "/analytics"
        },
        {
            id: 3,
            title: "Отчёты",
            icon: FileText,
            description: "Генерация и скачивание отчетов",
            color: "bg-gradient-to-br from-violet-500 to-purple-600",
            href: "/reports"
        },
        {
            id: 4,
            title: "Прогноз",
            icon: TrendingUp,
            description: "Прогноз урожайности на сезон",
            color: "bg-gradient-to-br from-amber-500 to-orange-600",
            href: "/forecast"
        },
    ];

    return (
        <div className="h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex flex-col">
            <header className="mb-8 pt-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        AI-карты садов
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Цифровой мониторинг плодовых насаждений
                    </p>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">
                        Доступные инструменты
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Выберите раздел для перехода
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                    {actionCards.map((card) => (
                        <a
                            key={card.id}
                            href={card.href}
                            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-4 cursor-pointer border border-gray-200 hover:border-emerald-300 flex flex-col items-center justify-between min-h-[140px]"
                        >
                            <div className={`${card.color} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>

                            <div className="text-center flex-1">
                                <h3 className="font-semibold text-sm text-gray-800 group-hover:text-emerald-700 transition-colors mb-1">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-xs leading-tight">
                                    {card.description}
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))}
                </div>
            </main>


        </div>
    );
};

export default Page;