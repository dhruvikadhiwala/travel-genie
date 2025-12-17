import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Trip } from './pages/Trip'
import { MyTrips } from './pages/MyTrips'
import { SharedTrip } from './pages/SharedTrip'
import { About } from './pages/About'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:city" element={<Trip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/shared/:shareToken" element={<SharedTrip />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}

export default App
