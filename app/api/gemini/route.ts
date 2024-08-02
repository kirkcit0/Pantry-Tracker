import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY; // Ensure this is set in your .env.local file
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body; // Expecting an array of items

    const prompt = `Create a recipe using the following ingredients: ${items.join(', ')}. Include as many listed ingredients as possible, 
    and avoid adding any extra ingredients, unless they are optional. You can also add salt & pepper, maybe other basic seasonings if need be. 
    If some ingredients can’t be used, omit them without mentioning limitations. Provide clear, complete instructions.`;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const recipe = result.response.text();

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error requesting recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch response from Gemini' }, { status: 500 });
  }
}
