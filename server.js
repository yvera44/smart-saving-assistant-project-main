require('dotenv').config();
const { container } = require("./db");
const express = require('express');
const axios = require('axios');
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

