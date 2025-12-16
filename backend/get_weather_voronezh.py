import requests
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
import calendar
import warnings

# Игнорируем предупреждения о депрекации
warnings.filterwarnings('ignore', category=FutureWarning)

# Настройки для графиков
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.figsize'] = [16, 12]
plt.rcParams['font.size'] = 11

def get_monthly_data_for_year(year):
    """Получает и агрегирует данные по месяцам за указанный год"""
    
    # Координаты Воронежа
    latitude = 51.672
    longitude = 39.1843
    
    print(f"Загрузка данных за {year} год...")
    
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": f"{year}-01-01",
        "end_date": f"{year}-12-31",
        "daily": "temperature_2m_max,temperature_2m_min,temperature_2m_mean,"
                 "relative_humidity_2m_mean,pressure_msl_mean,precipitation_sum",
        "timezone": "Europe/Moscow",
        "models": "best_match"
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        data = response.json()
        
        if "daily" not in data or not data["daily"]["time"]:
            print(f"  Нет данных за {year} год")
            return None
            
        # Создаем DataFrame
        records = []
        for i, date_str in enumerate(data["daily"]["time"]):
            records.append({
                "date": date_str,
                "temp_mean": data["daily"]["temperature_2m_mean"][i],
                "humidity": data["daily"]["relative_humidity_2m_mean"][i],
                "pressure": data["daily"]["pressure_msl_mean"][i],
                "precipitation": data["daily"]["precipitation_sum"][i]
            })
        
        df = pd.DataFrame(records)
        df['date'] = pd.to_datetime(df['date'])
        df['year'] = df['date'].dt.year
        df['month'] = df['date'].dt.month
        
        # Группируем по месяцам
        monthly_data = df.groupby(['year', 'month']).agg({
            'temp_mean': 'mean',
            'humidity': 'mean',
            'pressure': 'mean',
            'precipitation': 'sum'
        }).round(2)
        
        # Сбрасываем индекс для удобства
        monthly_data = monthly_data.reset_index()
        monthly_data['year_month'] = monthly_data['year'].astype(str) + '-' + monthly_data['month'].apply(lambda x: f'{x:02d}')
        
        print(f"  Загружено: {len(df)} дней, {len(monthly_data)} месяцев")
        return monthly_data
        
    except Exception as e:
        print(f"  Ошибка загрузки {year}: {e}")
        return None

def collect_all_years_data(start_year=2010, end_year=2023):
    """Собирает данные за все годы"""
    
    print(f"\nСбор данных за период {start_year}-{end_year}...")
    print("=" * 60)
    
    all_data = []
    successful_years = []
    
    for year in range(start_year, end_year + 1):
        yearly_data = get_monthly_data_for_year(year)
        if yearly_data is not None:
            all_data.append(yearly_data)
            successful_years.append(year)
    
    if not all_data:
        print("Не удалось загрузить данные ни за один год")
        return None
    
    # Объединяем все данные
    combined_df = pd.concat(all_data, ignore_index=True)
    
    print(f"\nИтого загружено:")
    print(f"  Годы: {successful_years}")
    print(f"  Всего месяцев: {len(combined_df)}")
    print(f"  Период: {combined_df['year'].min()} - {combined_df['year'].max()}")
    
    return combined_df

def create_monthly_trend_plots(df, start_year, end_year):
    """Создает 4 графика с трендами по месяцам за все годы"""
    
    if df is None or df.empty:
        print("Нет данных для создания графиков")
        return
    
    # Создаем фигуру с 4 графиками
    fig, axes = plt.subplots(2, 2, figsize=(18, 14))
    
    # Сортируем данные
    df = df.sort_values(['year', 'month'])
    
    # 1. ТЕМПЕРАТУРА: Тепловая карта по годам и месяцам
    ax1 = axes[0, 0]
    
    # Создаем матрицу для тепловой карты (годы × месяцы)
    years = sorted(df['year'].unique())
    months = range(1, 13)
    
    temp_matrix = np.full((len(years), len(months)), np.nan)
    
    for idx_year, year in enumerate(years):
        for idx_month, month in enumerate(months):
            mask = (df['year'] == year) & (df['month'] == month)
            if mask.any():
                temp_matrix[idx_year, idx_month] = df.loc[mask, 'temp_mean'].values[0]
    
    # Тепловая карта
    im = ax1.imshow(temp_matrix, cmap='RdYlBu_r', aspect='auto')
    
    # Настройка осей
    ax1.set_xticks(np.arange(len(months)))
    ax1.set_xticklabels([calendar.month_abbr[m] for m in months])
    ax1.set_yticks(np.arange(len(years)))
    ax1.set_yticklabels([str(y) for y in years])
    
    # Добавляем значения в ячейки
    for i in range(len(years)):
        for j in range(len(months)):
            if not np.isnan(temp_matrix[i, j]):
                text = ax1.text(j, i, f'{temp_matrix[i, j]:.1f}',
                              ha="center", va="center", color="black", fontsize=8)
    
    ax1.set_title(f'Средняя температура (°C) по месяцам ({start_year}-{end_year})', 
                 fontsize=14, fontweight='bold')
    ax1.set_xlabel('Месяц', fontsize=12)
    ax1.set_ylabel('Год', fontsize=12)
    
    # Цветовая шкала
    plt.colorbar(im, ax=ax1, label='Температура (°C)')
    
    # 2. ВЛАЖНОСТЬ: График по годам с группировкой по месяцам
    ax2 = axes[0, 1]
    
    # Создаем сводную таблицу
    humidity_pivot = df.pivot_table(index='year', columns='month', 
                                   values='humidity', aggfunc='mean')
    
    # Сортируем столбцы по месяцам
    humidity_pivot = humidity_pivot.reindex(sorted(humidity_pivot.columns), axis=1)
    
    # Создаем график
    colors = plt.cm.Set3(np.linspace(0, 1, 12))
    
    for month in range(1, 13):
        if month in humidity_pivot.columns:
            year_values = humidity_pivot.index
            humidity_values = humidity_pivot[month].values
            ax2.plot(year_values, humidity_values, marker='o', 
                    linewidth=2, markersize=5, 
                    label=calendar.month_abbr[month], color=colors[month-1])
    
    ax2.set_title(f'Средняя влажность (%) по годам ({start_year}-{end_year})', 
                 fontsize=14, fontweight='bold')
    ax2.set_xlabel('Год', fontsize=12)
    ax2.set_ylabel('Влажность (%)', fontsize=12)
    ax2.grid(True, alpha=0.3)
    ax2.legend(title='Месяц', ncol=3, fontsize=9)
    
    # 3. ДАВЛЕНИЕ: Месячные профили за все годы
    ax3 = axes[1, 0]
    
    # Создаем сводную таблицу
    pressure_pivot = df.pivot_table(index='year', columns='month', 
                                   values='pressure', aggfunc='mean')
    
    # Сортируем столбцы по месяцам
    pressure_pivot = pressure_pivot.reindex(sorted(pressure_pivot.columns), axis=1)
    
    # Боксплот по месяцам
    boxplot_data = []
    month_labels = []
    
    for month in range(1, 13):
        if month in pressure_pivot.columns:
            # Собираем данные за все годы для этого месяца
            month_data = pressure_pivot[month].dropna().values
            if len(month_data) > 0:
                boxplot_data.append(month_data)
                month_labels.append(calendar.month_abbr[month])
    
    if boxplot_data:
        # Исправленная строка: используем tick_labels вместо labels
        bp = ax3.boxplot(boxplot_data, patch_artist=True, tick_labels=month_labels)
        
        # Цвета для boxplot
        for patch in bp['boxes']:
            patch.set_facecolor('lightgreen')
            patch.set_alpha(0.7)
        
        # Добавляем средние значения
        for i, data in enumerate(boxplot_data):
            mean_val = np.mean(data)
            ax3.plot(i+1, mean_val, 'rD', markersize=8, label='Среднее' if i == 0 else "")
    
    ax3.set_title(f'Распределение давления по месяцам ({start_year}-{end_year})', 
                 fontsize=14, fontweight='bold')
    ax3.set_xlabel('Месяц', fontsize=12)
    ax3.set_ylabel('Давление (гПа)', fontsize=12)
    ax3.grid(True, alpha=0.3, axis='y')
    if boxplot_data:
        ax3.legend(['Среднее значение'])
    
    # 4. ОСАДКИ: Накопительная диаграмма по годам
    ax4 = axes[1, 1]
    
    # Группируем по годам и суммируем осадки
    yearly_precip = df.groupby('year')['precipitation'].sum().reset_index()
    
    # Создаем stacked bar chart по месяцам
    precip_by_month = df.pivot_table(index='year', columns='month', 
                                    values='precipitation', aggfunc='sum', fill_value=0)
    
    # Сортируем месяцы
    precip_by_month = precip_by_month.reindex(sorted(precip_by_month.columns), axis=1)
    
    # Накопительная сумма для stacked chart
    bottom = np.zeros(len(precip_by_month))
    
    # Цвета для месяцев
    month_colors = plt.cm.Blues(np.linspace(0.3, 0.9, 12))
    
    for idx, month in enumerate(range(1, 13)):
        if month in precip_by_month.columns:
            ax4.bar(precip_by_month.index, precip_by_month[month], 
                   bottom=bottom, color=month_colors[idx],
                   label=calendar.month_abbr[month], alpha=0.8, edgecolor='white', linewidth=0.5)
            bottom += precip_by_month[month].values
    
    ax4.set_title(f'Суммарные осадки по годам и месяцам ({start_year}-{end_year})', 
                 fontsize=14, fontweight='bold')
    ax4.set_xlabel('Год', fontsize=12)
    ax4.set_ylabel('Осадки (мм)', fontsize=12)
    ax4.grid(True, alpha=0.3, axis='y')
    ax4.legend(title='Месяц', ncol=3, fontsize=9, loc='upper left')
    
    # Исправленная строка: используем end_year вместо end
    plt.suptitle(f'Анализ погоды в Воронеже: {start_year}-{end_year} годы', 
                fontsize=18, fontweight='bold', y=1.02)
    
    plt.tight_layout()
    plt.show()
    
    # Сохраняем график
    filename = f"voronezh_weather_{start_year}_{end_year}_monthly_trends.png"
    fig.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"\nГрафики сохранены как: {filename}")
    
    return fig

def create_statistics_summary(df, start_year, end_year):
    """Создает сводную статистику"""
    
    print("\n" + "="*60)
    print("СВОДНАЯ СТАТИСТИКА")
    print("="*60)
    
    # Средние значения по годам
    yearly_stats = df.groupby('year').agg({
        'temp_mean': ['mean', 'min', 'max'],
        'humidity': 'mean',
        'pressure': 'mean',
        'precipitation': 'sum'
    }).round(2)
    
    print("\nСредние значения по годам:")
    print(yearly_stats)
    
    # Средние значения по месяцам за весь период
    monthly_stats = df.groupby('month').agg({
        'temp_mean': 'mean',
        'humidity': 'mean',
        'pressure': 'mean',
        'precipitation': 'mean'
    }).round(2)
    
    monthly_stats['month_name'] = [calendar.month_name[i] for i in monthly_stats.index]
    
    print("\nСредние значения по месяцам за весь период:")
    print(monthly_stats[['month_name', 'temp_mean', 'humidity', 'pressure', 'precipitation']])
    
    # Тренды
    print("\n" + "="*60)
    print("АНАЛИЗ ТРЕНДОВ")
    print("="*60)
    
    # Линейные тренды
    years = df['year'].unique()
    
    for param, label in [('temp_mean', 'Температура'), 
                        ('humidity', 'Влажность'), 
                        ('pressure', 'Давление')]:
        
        yearly_avg = df.groupby('year')[param].mean()
        
        if len(yearly_avg) > 1:
            # Линейная регрессия
            z = np.polyfit(yearly_avg.index, yearly_avg.values, 1)
            slope = z[0]
            
            trend_direction = "повышается" if slope > 0 else "понижается"
            print(f"{label}: {trend_direction} на {abs(slope):.3f} единиц в год")
    
    # Сохраняем данные
    csv_filename = f"voronezh_weather_{start_year}_{end_year}_monthly.csv"
    df.to_csv(csv_filename, index=False, encoding='utf-8-sig')
    print(f"\nДанные сохранены как: {csv_filename}")
    
    return yearly_stats, monthly_stats

def create_additional_visualizations(df, start_year, end_year):
    """Создает дополнительные визуализации"""
    
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    
    # 1. Аномалии температуры
    ax1 = axes[0, 0]
    
    # Рассчитываем среднюю температуру за весь период для каждого месяца
    monthly_norm = df.groupby('month')['temp_mean'].mean().reset_index()
    monthly_norm.columns = ['month', 'norm_temp']
    
    # Объединяем с исходными данными
    df_with_norm = pd.merge(df, monthly_norm, on='month')
    df_with_norm['temp_anomaly'] = df_with_norm['temp_mean'] - df_with_norm['norm_temp']
    
    # Группируем по годам
    yearly_anomaly = df_with_norm.groupby('year')['temp_anomaly'].mean()
    
    ax1.bar(yearly_anomaly.index, yearly_anomaly.values, 
           color=['red' if x > 0 else 'blue' for x in yearly_anomaly.values])
    ax1.axhline(y=0, color='black', linestyle='-', linewidth=1)
    ax1.set_title('Аномалии температуры относительно нормы', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Год', fontsize=12)
    ax1.set_ylabel('Отклонение от нормы (°C)', fontsize=12)
    ax1.grid(True, alpha=0.3, axis='y')
    
    # 2. Сезонные циклы
    ax2 = axes[0, 1]
    
    # Средние значения по месяцам за весь период
    monthly_avg = df.groupby('month').agg({
        'temp_mean': 'mean',
        'humidity': 'mean',
        'precipitation': 'mean'
    }).reset_index()
    
    # Нормализуем для сравнения
    for col in ['temp_mean', 'humidity', 'precipitation']:
        monthly_avg[f'{col}_norm'] = (monthly_avg[col] - monthly_avg[col].min()) / \
                                    (monthly_avg[col].max() - monthly_avg[col].min())
    
    months = monthly_avg['month']
    month_names = [calendar.month_abbr[m] for m in months]
    
    ax2.plot(months, monthly_avg['temp_mean_norm'], 'r-', marker='o', 
             label='Температура', linewidth=2)
    ax2.plot(months, monthly_avg['humidity_norm'], 'b-', marker='s', 
             label='Влажность', linewidth=2)
    ax2.plot(months, monthly_avg['precipitation_norm'], 'g-', marker='^', 
             label='Осадки', linewidth=2)
    
    ax2.set_title('Сезонные циклы (нормализованные)', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Месяц', fontsize=12)
    ax2.set_ylabel('Нормализованное значение', fontsize=12)
    ax2.set_xticks(months)
    ax2.set_xticklabels(month_names)
    ax2.grid(True, alpha=0.3)
    ax2.legend()
    
    # 3. Корреляция параметров
    ax3 = axes[1, 0]
    
    correlation = df[['temp_mean', 'humidity', 'pressure', 'precipitation']].corr()
    
    im = ax3.imshow(correlation, cmap='coolwarm', vmin=-1, vmax=1)
    
    # Добавляем значения
    for i in range(len(correlation)):
        for j in range(len(correlation)):
            text = ax3.text(j, i, f'{correlation.iloc[i, j]:.2f}',
                          ha="center", va="center", color="black", fontsize=10)
    
    ax3.set_xticks(range(len(correlation.columns)))
    ax3.set_yticks(range(len(correlation.columns)))
    ax3.set_xticklabels(['Темп.', 'Влаг.', 'Давл.', 'Осад.'], fontsize=11)
    ax3.set_yticklabels(['Темп.', 'Влаг.', 'Давл.', 'Осад.'], fontsize=11)
    ax3.set_title('Корреляция параметров', fontsize=14, fontweight='bold')
    plt.colorbar(im, ax=ax3)
    
    # 4. Самые теплые/холодные годы
    ax4 = axes[1, 1]
    
    yearly_avg_temp = df.groupby('year')['temp_mean'].mean().sort_values()
    
    # Берем 5 самых теплых и 5 самых холодных лет
    coldest_years = yearly_avg_temp.head(5)
    warmest_years = yearly_avg_temp.tail(5)
    
    y_pos = np.arange(10)
    years_list = list(coldest_years.index) + list(warmest_years.index[::-1])
    temps_list = list(coldest_years.values) + list(warmest_years.values[::-1])
    colors_list = ['blue'] * 5 + ['red'] * 5
    
    ax4.barh(y_pos, temps_list, color=colors_list)
    ax4.set_yticks(y_pos)
    ax4.set_yticklabels(years_list)
    ax4.set_xlabel('Средняя температура (°C)', fontsize=12)
    ax4.set_title('Самые холодные и теплые годы', fontsize=14, fontweight='bold')
    ax4.grid(True, alpha=0.3, axis='x')
    
    # Добавляем значения на столбцы
    for i, (temp, year) in enumerate(zip(temps_list, years_list)):
        ax4.text(temp + 0.1, i, f'{temp:.1f}°C', 
                va='center', fontsize=9, fontweight='bold')
    
    plt.suptitle(f'Дополнительный анализ: {start_year}-{end_year}', 
                fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.show()
    
    # Сохраняем
    filename = f"voronezh_weather_{start_year}_{end_year}_analysis.png"
    fig.savefig(filename, dpi=300, bbox_inches='tight')
    print(f"Дополнительные графики сохранены как: {filename}")

# Основной блок
if __name__ == "__main__":
    print("="*70)
    print("АНАЛИЗ ПОГОДЫ В ВОРОНЕЖЕ ПО МЕСЯЦАМ (2010-2023)")
    print("="*70)
    
    # Параметры анализа
    START_YEAR = 2010
    END_YEAR = 2023
    
    # 1. Сбор данных
    weather_data = collect_all_years_data(START_YEAR, END_YEAR)
    
    if weather_data is not None:
        # 2. Создание основных графиков
        print("\n" + "="*60)
        print("СОЗДАНИЕ ГРАФИКОВ")
        print("="*60)
        
        main_fig = create_monthly_trend_plots(weather_data, START_YEAR, END_YEAR)
        
        # 3. Статистический анализ
        yearly_stats, monthly_stats = create_statistics_summary(weather_data, START_YEAR, END_YEAR)
        
        # 4. Дополнительные визуализации
        print("\n" + "="*60)
        print("ДОПОЛНИТЕЛЬНЫЙ АНАЛИЗ")
        print("="*60)
        
        create_additional_visualizations(weather_data, START_YEAR, END_YEAR)
        
        print("\n" + "="*70)
        print("АНАЛИЗ ЗАВЕРШЕН УСПЕШНО!")
        print("="*70)
        
        # Вывод ключевых фактов
        print("\nКЛЮЧЕВЫЕ ФАКТЫ:")
        print("-" * 40)
        
        # Самый теплый и холодный год
        warmest_year = yearly_stats[('temp_mean', 'mean')].idxmax()
        warmest_temp = yearly_stats[('temp_mean', 'mean')].max()
        coldest_year = yearly_stats[('temp_mean', 'mean')].idxmin()
        coldest_temp = yearly_stats[('temp_mean', 'mean')].min()
        
        print(f"Самый теплый год: {warmest_year} ({warmest_temp}°C)")
        print(f"Самый холодный год: {coldest_year} ({coldest_temp}°C)")
        
        # Самый влажный и сухой год по осадкам
        wettest_year = yearly_stats[('precipitation', 'sum')].idxmax()
        wettest_precip = yearly_stats[('precipitation', 'sum')].max()
        driest_year = yearly_stats[('precipitation', 'sum')].idxmin()
        driest_precip = yearly_stats[('precipitation', 'sum')].min()
        
        print(f"Самый влажный год: {wettest_year} ({wettest_precip:.0f} мм осадков)")
        print(f"Самый сухой год: {driest_year} ({driest_precip:.0f} мм осадков)")
        
        # Самый теплый и холодный месяц в среднем
        warmest_month_idx = monthly_stats['temp_mean'].idxmax()
        warmest_month = calendar.month_name[warmest_month_idx]
        warmest_month_temp = monthly_stats.loc[warmest_month_idx, 'temp_mean']
        
        coldest_month_idx = monthly_stats['temp_mean'].idxmin()
        coldest_month = calendar.month_name[coldest_month_idx]
        coldest_month_temp = monthly_stats.loc[coldest_month_idx, 'temp_mean']
        
        print(f"Самый теплый месяц в среднем: {warmest_month} ({warmest_month_temp}°C)")
        print(f"Самый холодный месяц в среднем: {coldest_month} ({coldest_month_temp}°C)")
