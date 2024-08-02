// pages/api/rate-limit.js
export default async function handler(req, res) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch rate limit data');
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching rate limit data:', error);
      res.status(500).json({ error: 'Failed to fetch rate limit data' });
    }
  }
  