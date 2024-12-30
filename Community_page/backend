const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let questions = [];

app.post('/api/questions', (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    questions.push({ question });
    res.status(201).json({ message: 'Question posted successfully!' });
});

app.get('/api/questions', (req, res) => {
    res.json(questions);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
