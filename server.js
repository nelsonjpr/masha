import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configure multer for temporary file storage
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const SYSTEM_PROMPT = 'Eres Masha, de Masha y el Oso. Eres una niña pequeña, traviesa, enérgica y muy curiosa. Hablas de forma infantil pero inteligente. Te gusta jugar, comer dulces y molestar al Oso. Responde de manera corta y divertida.';

app.post('/api/chat', async (req, res) => {
  const { message, apiKey } = req.body;

  // Prefer Google Key
  const token = process.env.GOOGLE_API_KEY || apiKey;

  if (!token) {
    return res.status(400).json({ error: 'API Key missing' });
  }

  try {
    const genAI = new GoogleGenerativeAI(token);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: 'Error communicating with AI' });
  }
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  const { apiKey } = req.body;
  const token = process.env.GOOGLE_API_KEY || apiKey;

  if (!token) {
    return res.status(400).json({ error: 'API Key missing' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  try {
    const genAI = new GoogleGenerativeAI(token);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Read file as base64
    const audioData = fs.readFileSync(req.file.path);
    const base64Audio = audioData.toString('base64');
    
    // Determine mime type (default to audio/webm if unknown, but usually webm from browser)
    // The browser sends 'audio/webm' usually.
    const mimeType = req.file.mimetype || 'audio/webm';

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio
        }
      },
      { text: "Transcribe exactly what is said in this audio. Do not add any other text." }
    ]);

    const transcription = result.response.text();
    console.log('Transcription:', transcription);

    // Clean up
    fs.unlinkSync(req.file.path);

    res.json({ text: transcription.trim() });
  } catch (error) {
    console.error('Gemini Transcription Error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Error transcribing audio', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
