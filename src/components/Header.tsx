import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-semibold text-sky-600">Travel Genie</Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-sky-600' : 'text-slate-700 hover:text-slate-900'}>
            Home
          </NavLink>
          <NavLink to="/trip" className={({ isActive }) => isActive ? 'text-sky-600' : 'text-slate-700 hover:text-slate-900'}>
            Trip
          </NavLink>
          <a href="https://tanstack.com/query/latest" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-slate-900">Docs</a>
        </nav>
      </div>
    </header>
  );
}



