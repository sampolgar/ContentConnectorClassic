const express = require('express');
const content = require('./content.json')
const jmespath = require('jmespath');
const fs = require('fs')

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/oauth2/token' , (req, res) => {
    const tokenResponse = { 
        access_token: "fake_token",
        expires_in: "3600",
        token_type: "Bearer" 
    }
    res.send(tokenResponse);
});


app.get('/folders', (req, res) => {
    //filter the content.json file for folders
    try {
        const folderSearch = jmespath.search(content, 'folders')
        res.send(folderSearch)
    } catch (error) {
        console.log("folder search error")
        res.sendStatus(500)
    }
});


app.get('/images', (req, res) => {
    res.json(images)
});



app.listen(PORT, () => {
    console.log(`Express server currently running on port ${PORT}`)
});




