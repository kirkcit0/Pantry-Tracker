// app/api/llama/route.ts
import { NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY; // Ensure this is set in your .env.local file

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body; // Expecting an array of items

    const prompt = `Provide a recipe based on the following ingredients: ${items.join(', ')}.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // 'HTTP-Referer': `${YOUR_SITE_URL}`, // Optional
        // 'X-Title': `${YOUR_SITE_NAME}`, // Optional
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ recipe: data.choices[0].message.content });
  } catch (error) {
    console.error('Error requesting recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch response from LLaMA' }, { status: 500 });
  }
}
