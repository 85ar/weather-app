import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async (req: VercelRequest, res: VercelResponse) => {
  const { q, days = 3 } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Missing query param "q"' })
  }

  try {
    const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q,
        days,
        lang: 'ru',
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
