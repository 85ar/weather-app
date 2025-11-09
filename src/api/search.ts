import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async (req: VercelRequest, res: VercelResponse) => {
  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query param "q"' })
  }

  try {
    const response = await axios.get('https://api.weatherapi.com/v1/search.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q,
      },
    })
    res.json(response.data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Search API error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Failed to search cities' })
  }
}
