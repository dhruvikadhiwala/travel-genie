import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { CityInfo } from '../lib/types'
import { searchCity } from '../lib/fetcher'

interface CitySearchProps {
  onCitySelect: (city: CityInfo) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export function CitySearch({ 
  onCitySelect, 
  loading = false, 
  placeholder = "Search for a city...",
  className = ""
}: CitySearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: cities = [], isLoading, error } = useQuery({
    queryKey: ['cities', query],
    queryFn: () => searchCity(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => 
            prev < cities.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0 && cities[selectedIndex]) {
            handleCitySelect(cities[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, cities])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 2)
    setSelectedIndex(-1)
  }

  const handleCitySelect = (city: CityInfo) => {
    setQuery(city.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onCitySelect(city)
  }

  const handleInputFocus = () => {
    if (query.length > 2) {
      setIsOpen(true)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="input pl-10 pr-4 py-3 text-lg"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="loading-spinner h-5 w-5" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="loading-spinner h-5 w-5 mx-auto mb-2" />
              Searching...
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-center text-red-600">
              Error searching cities
            </div>
          ) : cities.length === 0 ? (
            <div className="px-4 py-3 text-center text-gray-500">
              No cities found
            </div>
          ) : (
            <>
              {cities.length > 1 && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                  <p className="text-sm text-blue-700">
                    Found {cities.length} cities with this name. Please select the correct one:
                  </p>
                </div>
              )}
              {cities.map((city, index) => (
              <button
                key={`${city.name}-${city.country}-${index}`}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.country}
                      {city.population && (
                        <span className="ml-2 text-gray-400">
                          • {city.population.toLocaleString()} people
                        </span>
                      )}
                    </div>
                  </div>
                  {cities.length > 1 && (
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  )}
                </div>
              </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
