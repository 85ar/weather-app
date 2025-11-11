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
  } catch (error: unknown) {
    console.error('Weather API error:', error instanceof Error ? error.message : 'Unknown error')

    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || 'Failed to fetch weather data',
      })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
