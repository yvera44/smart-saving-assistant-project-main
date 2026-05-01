import 'dotenv/config';
import { container } from './db.js';
import express from 'express';
import axios from 'axios';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
const app = express();

app.use(express.json());
app.use(express.static('public'));

// НОВИЙ - читає з Cosmos DB
app.get('/api/transactions', async (req, res) => {
    try {
        const { resources } = await container.items
            .query("SELECT * FROM c WHERE c.type = 'transaction' ORDER BY c._ts DESC")
            .fetchAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// РЕАЛЬНИЙ ЧАС
app.get('/api/transactions/live', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(async () => {
        try {
            const { resources } = await container.items
                .query("SELECT * FROM c WHERE c.type = 'transaction' ORDER BY c._ts DESC")
                .fetchAll();
            res.write(`data: ${JSON.stringify(resources)}\n\n`);
        } catch (error) {
            console.error(error);
        }
    }, 5000);

    req.on('close', () => clearInterval(interval));
});


// Save data to Cosmos DB
app.post('/api/save', async (req, res) => {
    try {
        const data = req.body;
        const result = await container.items.create({
            id: Date.now().toString(),
            type: data.type || 'general',
            ...data,
            createdAt: new Date()
        });
        res.json({ success: true, data: result.resource });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all data from Cosmos DB
app.get('/api/data', async (req, res) => {
    try {
        const { resources } = await container.items
            .query("SELECT * FROM c")
            .fetchAll();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const chatModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-flash",
    maxRetries: 2,
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const { resources } = await container.items
            .query("SELECT * FROM c WHERE c.type = 'transaction' ORDER BY c._ts DESC")
            .fetchAll();

        const transactionSummary = resources.map(t =>
            `${t.date} - ${t.name}: $${t.amount} (${t.category})`
        ).join('\n');

        const response = await chatModel.invoke(
            `You are a helpful personal finance assistant for a savings app.
             Keep responses concise and focused on budgeting, saving, and spending advice.
             
             Here is the user's real transaction history:
             ${transactionSummary}
             
             Use this data to give personalized advice when relevant.
             User message: ${message}`
        );
        
        res.json({ reply: response.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

