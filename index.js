const express = require('express');
const images = require('./images.json')
const fs = require('fs')

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/oauth2/token' , (req, res) => {
    const tokenResponse = { 
        access_token: "fake_token",
        expires_in: "3600",
        token_type: "Bearer" 
    }
    res.send(tokenResponse);
});


app.get('/images', (req, res) => {
    res.json(images)
});

app.get('/folders', (req, res) => {
    const folders = []
    res.send(folders)
});

app.listen(PORT, () => {
    console.log(`Express server currently running on port ${PORT}`)
});