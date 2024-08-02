// pages/api/llama.js
import { getLlamaResponse } from '../../lib/openrouter';

export default async function handler(req, res) {
  const { items } = req.body; // Expecting an array of items

  // Construct the prompt for LLaMA
  const prompt = `Provide a recipe based on the following ingredients: ${items.join(', ')}.`;

  try {
    const response = await getLlamaResponse(prompt);
    res.status(200).json({ recipe: response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response from LLaMA' });
  }
}
