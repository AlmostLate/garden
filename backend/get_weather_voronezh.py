import requests
import pandas as pd
from datetime import datetime


def get_historical_weather(start_year=2020, end_year=2023):
    """Получает исторические данные за диапазон лет через Open-Meteo"""
    latitude = 51.672
    longitude = 39.1843
    all_data = []

    for year in range(start_year, end_year + 1):
        print(f"Загружаю данные за {year} год...")
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": f"{year}-01-01",
            "end_date": f"{year}-12-31",
            "daily": "temperature_2m_mean,relative_humidity_2m_mean",
            "timezone": "Europe/Moscow",
            "models": "best_match"  # Использует наилучшую доступную модель реанализа
        }
        try:
            response = requests.get(url, params=params)
            data = response.json()
            for i, date in enumerate(data["daily"]["time"]):
                all_data.append({
                    "date": date,
                    "year": year,
                    "temp": data["daily"]["temperature_2m_mean"][i],
                    "humidity": data["daily"]["relative_humidity_2m_mean"][i]
                })
        except Exception as e:
            print(f"Ошибка загрузки {year}: {e}")

    return pd.DataFrame(all_data)

def analyze_yearly_averages(df):
    """Анализирует среднегодовые показатели"""
    if df.empty:
        print("Нет данных для анализа")
        return
    yearly_avg = df.groupby('year').agg({
        'temp': 'mean',
        'humidity': 'mean'
    }).round(2)
    overall_temp = df['temp'].mean()
    overall_humidity = df['humidity'].mean()
    print("\n" + "=" * 60)
    print("СРЕДНЕГОДОВЫЕ ПОКАЗАТЕЛИ ПОГОДЫ В ВОРОНЕЖЕ")
    print("=" * 60)
    print(f"Анализ за период: {df['year'].min()} - {df['year'].max()} годы")
    print("-" * 60)
    for year, row in yearly_avg.iterrows():
        temp_diff = row['temp'] - overall_temp
        hum_diff = row['humidity'] - overall_humidity
        print(f"\n{year} год:")
        print(f"  • Средняя температура: {row['temp']}°C "
              f"({'+' if temp_diff > 0 else ''}{temp_diff:.1f}°C от среднего)")
        print(f"  • Средняя влажность: {row['humidity']}% "
              f"({'+' if hum_diff > 0 else ''}{hum_diff:.1f}% от среднего)")
    print("\n" + "-" * 60)
    print(f"СРЕДНЕЕ ЗА ВЕСЬ ПЕРИОД ({df['year'].min()}-{df['year'].max()}):")
    print(f"  • Температура: {overall_temp:.1f}°C")
    print(f"  • Влажность: {overall_humidity:.1f}%")
    print("=" * 60)
    max_temp_year = yearly_avg['temp'].idxmax()
    min_temp_year = yearly_avg['temp'].idxmin()
    print(f"\nСАМЫЕ ТЁПЛЫЙ ГОД: {max_temp_year} ({yearly_avg.loc[max_temp_year, 'temp']}°C)")
    print(f"САМЫЙ ХОЛОДНЫЙ ГОД: {min_temp_year} ({yearly_avg.loc[min_temp_year, 'temp']}°C)")
if __name__ == "__main__":
    start_year = 2000  # Начните с 2000 или 2001 для 21 века
    end_year = 2023  # Максимум - прошлый год

    print(f"Загрузка исторических данных с {start_year} по {end_year} год...")
    weather_df = get_historical_weather(start_year, end_year)

    if not weather_df.empty:
        analyze_yearly_averages(weather_df)
        weather_df.to_csv(f"voronezh_weather_{start_year}_{end_year}.csv", index=False)
        print(f"\nДанные сохранены в voronezh_weather_{start_year}_{end_year}.csv")
    else:
        print("Не удалось загрузить данные.")
