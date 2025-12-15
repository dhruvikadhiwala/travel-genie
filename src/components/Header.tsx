import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPinIcon, SparklesIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { AuthModal } from './AuthModal'
import { auth } from '../lib/supabase'

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title = "Travel Genie", showBackButton = false }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    auth.getSession().then((session) => {
      setUser(session?.user || null)
    })

    // Listen for auth changes
    const subscription = auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (event === 'SIGNED_IN') {
        setIsAuthModalOpen(false)
      }
    })

    return () => {
      if (subscription && 'data' in subscription) {
        subscription.data.subscription.unsubscribe()
      }
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      setShowUserMenu(false)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
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
              
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <UserCircleIcon className="h-6 w-6 text-gray-600" />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/my-trips"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Trips
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn btn-outline text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn btn-primary text-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          // Refresh user state
          auth.getSession().then((session) => {
            setUser(session?.user || null)
          })
        }}
      />
    </>
  )
}
