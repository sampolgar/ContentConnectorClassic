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

//oauth requests
app.post('/oauth2/token' , (req, res) => {
    const tokenResponse = { 
        access_token: "fake_token",
        expires_in: "3600",
        token_type: "Bearer" 
    }
    res.send(tokenResponse);
});


//folder requests
app.get('/folders', (req, res) => {

    //search query
    //get the navigation path if it's available
    const folderSearchQuery = req.query.navigationPath;
    
    //if navigationPath is available, return the folders within the path
    if (folderSearchQuery !== undefined) {
        try {
            const jmespathExpression = `folders[?navigationPath=='${folderSearchQuery}']`;
            const folderSearch = jmespath.search(content, jmespathExpression);
            res.send(folderSearch)
        } catch (error) {
            console.log("folder search with navigationpath error")
            res.sendStatus(500);
        }

    } else {
            //filter the content.json file for all folders
    try {
        const folderSearch = jmespath.search(content, 'folders')
        res.send(folderSearch)
    } catch (error) {
        console.log("folder search error")
        res.sendStatus(500)
    }
    }
});



//image requests
app.get('/images', (req, res) => {

    //support search queries
    const folderSearchQuery = req.query.navigationPath;                 //which folder to search
    const imageSearchQuery = req.query.searchQuery;                     //what to search for
    const pageNumber = req.query.pageNumber;                            //support pagination

    //support default search query images?navigationPath=&pageNumber=1
    
    //if navigation path is empty, search through all images
    if (folderSearchQuery === undefined) {
});

    //if navigation path is empty, search through all images



app.listen(PORT, () => {
    console.log(`Express server currently running on port ${PORT}`)
});




