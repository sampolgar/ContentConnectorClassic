const express = require("express");
const content = require("./content.json");
const jmespath = require("jmespath");
const fs = require("fs");

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

//oauth requests
app.post("/oauth2/token", (req, res) => {
  const tokenResponse = {
    access_token: "fake_token",
    expires_in: "3600",
    token_type: "Bearer",
  };
  res.send(tokenResponse);
});

//folder requests
app.get("/folders", (req, res) => {
  //get the navigation path if it's available
    let navigationPath = req.query.navigationPath;

  //if navigationPath is available, return the folders within the path
  if (navigationPath && navigationPath !== undefined) {
      
    if (navigationPath.endsWith("/")) {
        navigationPath = navigationPath.slice(0, -1);
      }

    try {
        //get the folderid from the navigation path. If the nav path is 100/101, we want to get 101
        const folderJmesPathExpression = `folders[?navigationPath=='${navigationPath}']`;
        const folderIdSearch = jmespath.search(content, folderJmesPathExpression);
        const folderId = folderIdSearch[0].id;

        //find all subfolders within the folderid
        const jmesPathExpression = `folders[?parentFolderId=='${folderId}']`;
        const folderSearch = jmespath.search(content, jmesPathExpression);
        res.send(folderSearch);
    } catch (error) {
      console.log("folder search with navigationpath error" + error);
      res.sendStatus(500);
    }
  } else {
    //display the root folder
    try {
    const jmespathExpression = `min_by(folders, &id)`
    const folderSearch = [jmespath.search(content, jmespathExpression)];
    res.send(folderSearch);
    } catch (error) {
      console.log(error + " folder search error");
      res.sendStatus(500);
    }
  }
});


//image requests

app.get("/images", (req, res) => {
  //support search queries
  const imageSearchQuery = req.query.searchQuery;   //what to search for
  const pageNumber = req.query.pageNumber;          //support pagination
  let navigationPath = req.query.navigationPath;    //which folder to search

    if (navigationPath.endsWith("/")) {
        navigationPath = navigationPath.slice(0, -1);
    }

    //1. images?navigationPath=&pageNumber=1
  if (!navigationPath && imageSearchQuery === undefined) {
    console.log("hello here in images");
    
    //return all images except if folders are present. If folders, return folders.
    try {
      const imageArry = []
      res.send(imageArry);
    } catch (error) {
      console.log(error + " 1st image search error");
      res.sendStatus(500);
    }
    
  } else if (navigationPath && navigationPath !== undefined) {
    //2. images?navigationPath=100&pageNumber=1 find all images in the navigation path

    if (!navigationPath.includes("/")) {
      try {
        const imageJmesPathExpression = `images[?folderId=='${navigationPath}']`;
        const imageSearch = jmespath.search(content, imageJmesPathExpression);
        res.send(imageSearch);
      } catch (error) {
        console.log(
          error +
            " error with search like images?navigationPath=100&pageNumber=1"
        );
        res.sendStatus(500);
      }
    } else {
      try {
        //get the folderid from the navigation path
        const folderJmesPathExpression = `folders[?navigationPath=='${navigationPath}']`;
        const folderSearch = jmespath.search(content, folderJmesPathExpression);
        const folderId = folderSearch[0].id;
        console.log("folderId: ", folderId);

        //get the images from this folder
        const imageJmesPathExpression = `images[?folderId=='${folderId}']`;
        const imageSearch = jmespath.search(content, imageJmesPathExpression);
        res.send(imageSearch);
      } catch (error) {
        console.log(error + " 2nd image search error");
        res.sendStatus(500);
      }
    }
  } else if (imageSearchQuery !== undefined) {
    //e.g. images?searchQuery=flower&pageNumber=1
    try {
      const currentSearchQuery = imageSearchQuery.toLowerCase();
      const jmespathExpression = `images[?imagename.contains(@, '${currentSearchQuery}') || tags.contains(@, '${currentSearchQuery}')]`;
      const imageSearch = jmespath.search(content, jmespathExpression);
      res.send(imageSearch);
    } catch (error) {
      console.log(error + " 3rd image search error");
      res.sendStatus(500);
    }
  } else {
    console.log(error + " end of else if statement. Need to catch this");
    res.sendStatus(500);
  }
});

//download request
app.get("/images/:imgid", (req, res) => {
    const imageId = req.params.imgid
    try {
        const jmespathExpression = `images[?id=='${imageId}'].previewUrl | [0]`;
        const imageDownloadSearch = jmespath.search(content, jmespathExpression);
        downloadObj = {
            "downloadUrl": imageDownloadSearch
        }
        res.send(downloadObj);
    }
    catch {
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
  console.log(`Express server currently running on port ${PORT}`);
});
