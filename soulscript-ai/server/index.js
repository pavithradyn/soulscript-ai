const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-hook', async (req, res) => {
    try {
        const { story } = req.body;
        console.log("Input Story:", story);

        // List-la irunthu edutha stable model
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

       // server/index.js kulla prompt-a ippadi update pannunga:

// server/index.js
const prompt = `
    The following input is a story idea for a podcast. It might be in English, Tamil, or a mix of both (Tanglish).
    
    INPUT STORY: "${story}"
    
    YOUR MISSION:
    1. Identify the core plot and emotions, regardless of the language used in the input.
    2. Transform this into 3 professional, high-impact PODCAST SCRIPTS in ENGLISH ONLY.
    3. Each script must have:
       - A "Hook" (To grab listeners)
       - A "Narrative Body" (The full story in a cinematic way)
       - A "Closing" (A deep, thought-provoking ending)

    STRICT RULE: Even if the input is 100% Tamil, the output MUST be 100% English. 
    Make it sound like a top-tier global podcast (like 'The Daily' or 'Serial').`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        console.log("AI Response Ready! ✅");
        res.json({ suggestion: aiText });

    } catch (error) {
        console.error("API ERROR:", error.message);
        res.status(500).json({ error: "AI failed", details: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});