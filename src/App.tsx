import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Trip } from './pages/Trip'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:city" element={<Trip />} />
      </Routes>
    </div>
  )
}

export default App
