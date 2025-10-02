import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CitySearch() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    navigate(`/trip?city=${encodeURIComponent(city.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
        placeholder="Search city (e.g., Paris)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit" className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Search</button>
    </form>
  );
}



