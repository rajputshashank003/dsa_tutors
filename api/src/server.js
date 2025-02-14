import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { dsa_tutor } from "./constants/constants.js";

dotenv.config();

const app = express();
app.use(cors({credentials: true , origin: '*'}));
app.use(express.json());

const key = process.env.API_GEMINI_AI;

if (!key) {
    console.error("API_GEMINI_AI environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(key);

// In-memory storage for conversation history
const conversationHistory = {};

app.post("/dsa_tutor", async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { prompt, userId } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ error: "Prompt and userId are required" });
    }

    // Initialize conversation history for the user if it doesn't exist
    if (!conversationHistory[userId]) {
        conversationHistory[userId] = [{ role : "user" , content : dsa_tutor + " "}];
    }

    // Append the new prompt to the user's conversation history
    conversationHistory[userId].push({ role: "user", content:  prompt });

    // Create a context for the model by joining previous messages
    const context = conversationHistory[userId]
        .map((msg) => `${msg.role === "user" ? "User" : "Tutor"}: ${msg.content}`)
        .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContentStream(context + "\nTutor: ");

        let fullResponse = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
            fullResponse += chunkText;
        }

        // Append the tutor's response to the conversation history
        conversationHistory[userId].push({ role: "tutor", content: fullResponse });
        res.end();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

app.listen(8000, () => {
    console.log("✅ Server running on http://localhost:8000");
});