const express = require('express');
const res = require('express/lib/response');
const images = require('./images.json')

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/images', (req, res) => {
    res.json(images)
});

app.get('/images/:id', req, res) => {
    const imgId = Number(req.params.id);
    const getImg = images.find((img) => img.id === imgId);

    if(!getImg) {
        res.status(500).send('img not found.')
    } else {
        res.json(getImg)
    }
}

app.post('/oauth2/token/', (req, res) => {
    res.send('Hello: '+JSON.stringify(req.body));
})

app.listen(PORT, () => {
    console.log(`Express server currently running on port ${PORT}`)
});
// [label index.js]
