// lib/openrouter.js
import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'; // Update if necessary
const API_KEY = process.env.OPENROUTER_API_KEY;

export const getLlamaResponse = async (prompt) => {
  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'llama-3.1', // Ensure this matches the model identifier used by OpenRouter
        messages: [{ role: 'user', content: prompt }],
      },
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content; // Adjust based on response structure
  } catch (error) {
    console.error('Error fetching LLaMA response:', error);
    throw error;
  }
};
