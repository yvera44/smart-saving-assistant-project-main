require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));



app.get('/api/transactions', (req, res) => {
    const transactions = require('./transactions.json');
    res.json(transactions);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});