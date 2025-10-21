import { Link } from 'react-router-dom'
import { MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title = "Travel Genie", showBackButton = false }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Link
                to="/"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Back to home"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {title === "Travel Genie" && (
                  <p className="text-sm text-gray-500">Your personal trip explorer</p>
                )}
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <MapPinIcon className="w-4 h-4 mr-1" />
              Discover amazing destinations
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="btn btn-outline text-sm">
                Sign In
              </button>
              <button className="btn btn-primary text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
