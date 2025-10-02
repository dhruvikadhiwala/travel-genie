import CitySearch from '@/components/CitySearch';
import MapView from '@/components/MapView';
import WeatherChart from '@/components/WeatherChart';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Travel Genie</h1>
        <p className="text-slate-600">Discover weather, events, and points of interest for your next trip.</p>
        <CitySearch />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Weather</h2>
          <WeatherChart />
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Map</h2>
          <MapView />
        </div>
      </section>
    </div>
  );
}



