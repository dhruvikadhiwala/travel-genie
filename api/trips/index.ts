import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing' 
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    if (req.method === 'GET') {
      // GET endpoint: Retrieve trips from database
      const userId = req.query.userId as string | undefined
      const shareToken = req.query.shareToken as string | undefined

      if (shareToken) {
        // Get public trip by share token
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('share_token', shareToken)
          .eq('is_public', true)
          .single()

        if (error) {
          return res.status(404).json({ error: 'Trip not found' })
        }

        return res.status(200).json(data)
      }

      if (!userId) {
        return res.status(400).json({ error: 'userId or shareToken required' })
      }

      // Get user's trips
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json(data || [])
    }

    if (req.method === 'POST') {
      // POST endpoint: Create a new trip
      const { user_id, city, country, lat, lon, notes } = req.body

      if (!user_id || !city || !country || lat === undefined || lon === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: user_id, city, country, lat, lon' 
        })
      }

      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id,
          city,
          country,
          lat,
          lon,
          notes: notes || null,
          is_public: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(201).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}

