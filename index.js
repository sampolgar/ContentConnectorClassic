const express = require('express');
const images = require('./images.json')
const fs = require('fs')

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/images', (req, res) => {
    res.json(images)
});

app.get('/images/:id', (req, res) => {
    const imgId = Number(req.params.id);
    const getImg = images.find((img) => img.id === imgId);

    if(!getImg) {
        res.status(500).send('img not found.')
    } else {
        res.json(getImg)
    }
});

app.post('/images', (req, res) => {
    let getImageData = new Promise(function(response, rejected){
        console.log('here'+JSON.stringify(req.body))
        response(testPost())
    })

    getImageData
    .then(function(success){
        res.send('Hello: '+JSON.stringify(req.body));
    }, function(error){
        console.log(error)
    })
})

function testPost(){
    console.log('jaldkfjklajdflksjalksdf')
    const incomingImg = {
        "id": 5,
        "name": "image5",
        "link": "https:1231234.com"
    };
}


app.post('/oauth2/token/', (req, res) => {
    res.send('Hello: '+JSON.stringify(req.body));
})

app.listen(PORT, () => {
    console.log(`Express server currently running on port ${PORT}`)
});