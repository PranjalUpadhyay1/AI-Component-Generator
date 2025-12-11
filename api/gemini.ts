import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const extractCode = (response: string | undefined): string => {
  if (!response) return "";
  const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
  return match ? match[1].trim() : response.trim();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { prompt, framework } = req.body;

  if (!prompt || !framework) {
    return res.status(400).json({ error: 'Missing prompt or framework' });
  }

  // Access the API key from a server-side environment variable
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({ error: 'Gemini API Key not configured on server' });
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, TypeScript, React, Next.js, Vue.js, Angular, and more.

        Now, generate a UI component for: ${prompt}  
        Framework to use: ${framework}  

        Requirements:  
        The code must be clean, well-structured, and easy to understand.  
        Optimize for SEO where applicable.  
        Focus on creating a modern, animated, and responsive UI design.  
        Include high-quality hover effects, shadows, animations, colors, and typography.  
        Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
        Do NOT include explanations, text, comments, or anything else besides the code.  
        And give the whole code in a single file.
      `,
    });

    res.status(200).json({ code: extractCode(response.text) });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate content from Gemini API' });
  }
}