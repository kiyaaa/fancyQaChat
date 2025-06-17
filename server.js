const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('.'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo.html'));
});

app.get('/chatbot', (req, res) => {
    res.sendFile(path.join(__dirname, 'chatbot.html'));
});

app.get('/yeongyul-demo', (req, res) => {
    res.sendFile(path.join(__dirname, 'yeongyul-demo.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});