/**
 * Health Check Endpoint
 * Simple endpoint to verify the API is running
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    message: 'Vercel + Supabase deployment'
  })
}
