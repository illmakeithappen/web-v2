/**
 * DataBank API Endpoint
 * Handles content items queries for the DataBank resource library
 *
 * Note: This is optional - most queries can be done directly from frontend
 * using Supabase client. This endpoint exists for any server-side processing needs.
 */

import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY  // Use service key for admin operations
  )

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' })
}
