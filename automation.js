const Airtable = require('airtable');
require('dotenv').config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appXXXXXXXXXXXXXX');

function logQuestionToAirtable(question, answer) {
    base('Questions').create([
        {
            fields: {
                Question: question,
                Answer: answer
            }
        }
    ], (err, records) => {
        if (err) {
            console.error('Error logging to Airtable:', err);
            return;
        }
        console.log('Logged to Airtable:', records[0].getId());
    });
}

module.exports = { logQuestionToAirtable };