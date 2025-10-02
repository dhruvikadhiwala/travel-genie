import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const sample = [
  { day: 'Mon', temp: 18 },
  { day: 'Tue', temp: 19 },
  { day: 'Wed', temp: 20 },
  { day: 'Thu', temp: 22 },
  { day: 'Fri', temp: 21 },
  { day: 'Sat', temp: 19 },
  { day: 'Sun', temp: 17 },
];

export default function WeatherChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={sample} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis unit="°C" />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}



