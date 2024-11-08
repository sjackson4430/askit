const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});


app.post('/ask', async (req, res) => {
    const question = req.body.question;
    try {
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {  // Updated endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // Updated model
                messages: [{              // Updated format for chat completion
                    role: 'user',
                    content: question
                }],
                max_tokens: 100
            })
        });

        if (!openAIResponse.ok) {
            const errorData = await openAIResponse.json();
            console.error('OpenAI API Error:', errorData);
            return res.status(openAIResponse.status).json({
                error: 'OpenAI API Error',
                details: errorData
            });
        }

        const data = await openAIResponse.json();
        res.json({ answer: data.choices[0].message.content.trim() });  // Updated response format
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Error interacting with AI',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});