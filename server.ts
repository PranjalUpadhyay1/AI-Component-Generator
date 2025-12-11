import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, framework } = req.body;

    if (!prompt || !framework) {
      return res.status(400).json({ error: 'Prompt and framework are required.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const fullPrompt = `
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
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ code: text });
  } catch (error) {
    console.error('Error in /api/gemini:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
