import { WeatherData } from '../lib/types'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface WeatherChartProps {
  weather: WeatherData;
}

interface WeatherChartData {
  date: string;
  dateFormatted: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
}

const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '❄️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '🌦️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Heavy thunderstorm with hail', icon: '⛈️' },
}

function getWeatherInfo(code: number) {
  return WEATHER_CODES[code] || { description: 'Unknown', icon: '❓' }
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WeatherChartData
    const weatherInfo = getWeatherInfo(data.weatherCode)
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-blue-600">
            High: {data.maxTemp}°C
          </p>
          <p className="text-blue-400">
            Low: {data.minTemp}°C
          </p>
          <p className="text-gray-600">
            {weatherInfo.icon} {weatherInfo.description}
          </p>
          {data.precipitation > 0 && (
            <p className="text-blue-500">
              Precipitation: {data.precipitation}mm
            </p>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function WeatherChart({ weather }: WeatherChartProps) {
  // Transform weather data for the chart
  const chartData: WeatherChartData[] = weather.daily.time.map((date, index) => ({
    date,
    dateFormatted: format(parseISO(date), 'MMM dd'),
    maxTemp: Math.round(weather.daily.temperature_2m_max[index]),
    minTemp: Math.round(weather.daily.temperature_2m_min[index]),
    precipitation: Math.round(weather.daily.precipitation_sum[index] * 10) / 10,
    weatherCode: weather.daily.weathercode[index],
  }))

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          7-Day Weather Forecast
        </h3>
        <p className="text-sm text-gray-600">
          Temperature and precipitation forecast
        </p>
      </div>

      <div className="space-y-6">
        {/* Temperature Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Temperature</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="maxTemp" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="minTemp" 
                stroke="#60a5fa" 
                strokeWidth={3}
                dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Precipitation Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Precipitation</h4>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="dateFormatted" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}mm`, 'Precipitation']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar 
                dataKey="precipitation" 
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chartData.slice(0, 4).map((day) => {
            const weatherInfo = getWeatherInfo(day.weatherCode)
            return (
              <div key={day.date} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg mb-1">{weatherInfo.icon}</div>
                <div className="text-xs font-medium text-gray-900">{day.dateFormatted}</div>
                <div className="text-sm text-blue-600 font-semibold">
                  {day.maxTemp}°/{day.minTemp}°
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {weatherInfo.description}
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-500 mt-1">
                    {day.precipitation}mm
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
