import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Trip, Favorite, SearchHistory } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging - always log in production to help debug
console.log('[Supabase Init]', {
  env: import.meta.env.MODE,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  inBrowser: typeof window !== 'undefined',
  hasFetch: typeof fetch !== 'undefined',
  hasGlobalThis: typeof globalThis !== 'undefined'
})

// Initialize Supabase client
let supabaseInstance: SupabaseClient | null = null

function initializeClient() {
  if (typeof window === 'undefined' || !supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing required configuration:', {
      inBrowser: typeof window !== 'undefined',
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    })
    return
  }

  const cleanUrl = supabaseUrl.trim()
  const cleanKey = supabaseAnonKey.trim()
  
  if (!cleanUrl || !cleanKey || (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))) {
    console.warn('[Supabase] Invalid URL or key format')
    return
  }

  try {
    console.log('[Supabase] Attempting to create client...')
    console.log('[Supabase] Environment check:', {
      fetch: typeof fetch,
      globalThis: typeof globalThis,
      window: typeof window,
      Headers: typeof Headers,
      Request: typeof Request,
      Response: typeof Response
    })
    
    // Ensure all required Web APIs are available
    if (typeof fetch === 'undefined' || typeof Headers === 'undefined' || 
        typeof Request === 'undefined' || typeof Response === 'undefined') {
      throw new Error('Required Web APIs are not available')
    }

    // Verify that Headers can be instantiated
    try {
      new Headers()
      console.log('[Supabase] Headers constructor test passed')
    } catch (e) {
      console.error('[Supabase] Headers constructor test failed:', e)
      throw new Error('Headers constructor is not available')
    }

    // Try absolute simplest config first (just URL and key)
    try {
      console.log('[Supabase] Attempting minimal config (URL + key only)...')
      supabaseInstance = createClient(cleanUrl, cleanKey)
      console.log('[Supabase] ✓ Client created with minimal config')
    } catch (minimalError: any) {
      console.error('[Supabase] Minimal config failed:', minimalError?.message)
      
      // Try with explicit fetch binding
      try {
        console.log('[Supabase] Attempting with explicit fetch binding...')
        const globalFetch = typeof window !== 'undefined' ? window.fetch : fetch
        supabaseInstance = createClient(cleanUrl, cleanKey, {
          global: {
            fetch: globalFetch,
          },
        })
        console.log('[Supabase] ✓ Client created with explicit fetch')
      } catch (fetchError: any) {
        console.error('[Supabase] Explicit fetch also failed:', fetchError?.message)
        throw fetchError
      }
    }
  } catch (error: any) {
    console.error('[Supabase] ✗ Client creation failed:', error)
    console.error('[Supabase] Error message:', error?.message)
    console.error('[Supabase] Error name:', error?.name)
    console.error('[Supabase] Error stack:', error?.stack?.substring(0, 500))
    supabaseInstance = null
  }
}

// Initialize when DOM is ready (helps with Vite bundling issues)
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeClient)
  } else {
    // DOM is already ready, initialize immediately
    initializeClient()
  }
}

export const supabase: SupabaseClient | null = supabaseInstance

// Log warning if Supabase is not configured
if (!supabase) {
  if (import.meta.env.DEV) {
    console.warn('Supabase is not configured. Authentication and database features will not work.')
  } else {
    console.warn('Supabase is not configured. Please check environment variables.')
  }
}

// Helper to ensure supabase is not null (for TypeScript)
function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  return supabase
}

// Database helper functions
export const db = {
  // Get current user
  async getCurrentUser() {
    if (!supabase) return null
    const { data: { user } } = await (supabase as any).auth.getUser()
    return user
  },

  // Save a trip
  async saveTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) {
    const client = requireSupabase()

    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to save trips')
    }

    const { data, error } = await client
      .from('trips')
      .insert({
        ...trip,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error saving trip:', error)
      throw error
    }

    if (!data) return null

    // Normalize field names from snake_case to camelCase
    const tripData = data as any
    return {
      id: tripData.id,
      city: tripData.city,
      country: tripData.country,
      lat: tripData.lat,
      lon: tripData.lon,
      notes: tripData.notes,
      createdAt: tripData.created_at || tripData.createdAt,
      updatedAt: tripData.updated_at || tripData.updatedAt,
      userId: tripData.user_id || tripData.userId,
      isPublic: tripData.is_public || tripData.isPublic,
      shareToken: tripData.share_token || tripData.shareToken,
    }
  },

  // Get user's trips
  async getTrips() {
    if (!supabase) return []

    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await (supabase as any)
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching trips:', error)
      return []
    }

    // Normalize field names from snake_case to camelCase
    return (data || []).map((trip: any) => ({
      id: trip.id,
      city: trip.city,
      country: trip.country,
      lat: trip.lat,
      lon: trip.lon,
      notes: trip.notes,
      createdAt: trip.created_at || trip.createdAt,
      updatedAt: trip.updated_at || trip.updatedAt,
      userId: trip.user_id || trip.userId,
      isPublic: trip.is_public || trip.isPublic,
      shareToken: trip.share_token || trip.shareToken,
    }))
  },

  // Get a single trip by ID
  async getTrip(id: string) {
    if (!supabase) return null

    const { data, error } = await (supabase as any)
      .from('trips')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching trip:', error)
      return null
    }

    if (!data) return null

    // Normalize field names
    return {
      id: data.id,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      notes: data.notes,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
      userId: data.user_id || data.userId,
      isPublic: data.is_public || data.isPublic,
      shareToken: data.share_token || data.shareToken,
    }
  },

  // Get a public trip by share token
  async getPublicTrip(shareToken: string) {
    if (!supabase) return null

    const { data, error } = await (supabase as any)
      .from('trips')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single()

    if (error) {
      console.error('Error fetching public trip:', error)
      return null
    }

    if (!data) return null

    // Normalize field names
    return {
      id: data.id,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      notes: data.notes,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
      userId: data.user_id || data.userId,
      isPublic: data.is_public || data.isPublic,
      shareToken: data.share_token || data.shareToken,
    }
  },

  // Update a trip
  async updateTrip(id: string, updates: Partial<Trip>) {
    if (!supabase) return null

    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to update trips')
    }

    const { data, error } = await (supabase as any)
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating trip:', error)
      throw error
    }

    if (!data) return null

    // Normalize field names
    return {
      id: data.id,
      city: data.city,
      country: data.country,
      lat: data.lat,
      lon: data.lon,
      notes: data.notes,
      createdAt: data.created_at || data.createdAt,
      updatedAt: data.updated_at || data.updatedAt,
      userId: data.user_id || data.userId,
      isPublic: data.is_public || data.isPublic,
      shareToken: data.share_token || data.shareToken,
    }
  },

  // Delete a trip
  async deleteTrip(id: string) {
    if (!supabase) return false

    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to delete trips')
    }

    const { error } = await (supabase as any)
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting trip:', error)
      return false
    }

    return true
  },

  // Save a favorite
  async saveFavorite(favorite: Omit<Favorite, 'id' | 'createdAt'>) {
    if (!supabase) return null

    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to save favorites')
    }

    const { data, error } = await (supabase as any)
      .from('favorites')
      .insert({
        ...favorite,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving favorite:', error)
      throw error
    }

    return data
  },

  // Get favorites for a trip
  async getFavorites(tripId: string) {
    if (!supabase) return []

    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await (supabase as any)
      .from('favorites')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching favorites:', error)
      return []
    }

    return data || []
  },

  // Delete a favorite
  async deleteFavorite(id: string) {
    if (!supabase) return false

    const user = await this.getCurrentUser()
    if (!user) return false

    const { error } = await (supabase as any)
      .from('favorites')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting favorite:', error)
      return false
    }

    return true
  },

  // Save search history
  async saveSearch(search: Omit<SearchHistory, 'id' | 'createdAt'>) {
    if (!supabase) return null

    const user = await this.getCurrentUser()
    
    const { data, error } = await (supabase as any)
      .from('search_history')
      .insert({
        ...search,
        user_id: user?.id || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving search:', error)
      return null
    }

    return data
  },

  // Get search history
  async getSearchHistory(limit = 10) {
    if (!supabase) return []

    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await (supabase as any)
      .from('search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching search history:', error)
      return []
    }

    return data || []
  },

  // Generate share token for a trip
  async generateShareToken(tripId: string) {
    const client = requireSupabase()

    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User must be authenticated to share trips')
    }

    // Check if trip exists and belongs to user, and get current share_token
    const { data: existingTrip, error: fetchError } = await client
      .from('trips')
      .select('id, share_token, is_public')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching trip:', fetchError)
      throw new Error(`Trip not found: ${fetchError.message}`)
    }

    if (!existingTrip) {
      throw new Error('Trip not found or you do not have permission to share it')
    }

    // Use existing token if available, otherwise generate new one
    const tripData = existingTrip as any
    let shareToken = tripData.share_token
    
    // If already public with a token, return it
    if (tripData.is_public && shareToken) {
      return shareToken
    }

    // Generate new token if needed
    if (!shareToken) {
      shareToken = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15) +
                   Date.now().toString(36)
    }

    // Update the trip to make it public with the share token
    const { error: updateError } = await (client as any)
      .from('trips')
      .update({
        share_token: shareToken,
        is_public: true,
      })
      .eq('id', tripId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating trip:', updateError)
      console.error('Error code:', updateError.code)
      console.error('Error message:', updateError.message)
      console.error('Error details:', updateError.details)
      console.error('Error hint:', updateError.hint)
      throw new Error(`Failed to update trip: ${updateError.message}. Code: ${updateError.code}`)
    }

    return shareToken
  },
}

// Auth helper functions
export const auth = {
  // Sign up with email
  async signUp(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await (supabase as any).auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await (supabase as any).auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign in with magic link
  async signInWithMagicLink(email: string) {
    if (!supabase) {
      throw new Error('Supabase not configured')
    }

    const { data, error } = await (supabase as any).auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    if (!supabase) return

    const { error } = await (supabase as any).auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    if (!supabase) return null

    const { data: { session } } = await (supabase as any).auth.getSession()
    return session
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return () => {}

    return (supabase as any).auth.onAuthStateChange(callback)
  },
}



