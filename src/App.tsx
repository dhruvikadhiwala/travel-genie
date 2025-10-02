import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/Home';
import Trip from '@/pages/Trip';
import Header from '@/components/Header';

export default function App() {
  const [theme] = useState<'light' | 'dark'>('light');
  return (
    <BrowserRouter>
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-white text-slate-900">
          <Header />
          <main className="container py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trip" element={<Trip />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="container py-8 text-center text-sm text-slate-500">
            Built with React, Vite, Tailwind, TanStack Query, Recharts, and Leaflet.
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="text-sky-600 hover:underline">Go home</Link>
    </div>
  );
}



