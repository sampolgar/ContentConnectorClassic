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

    for (const key in req.query) {
        console.log("hello"+key, req.query[key])
      }

  //search query - get the navigation path if it's available. If it ends with a '/', remove it.
  let navigationPath = req.query.navigationPath;
  if ( navigationPath.endsWith("/")) {
    navigationPath = navigationPath.slice(0, -1);
  }

  //if navigationPath is available, return the folders within the path
  if (navigationPath && navigationPath !== undefined) {
    try {
      const jmespathExpression = `folders[?navigationPath=='${navigationPath}']`;
      const folderSearch = jmespath.search(content, jmespathExpression);
      console.log("sending back folder search: ", folderSearch);
      res.send(folderSearch);

    } catch (error) {
      console.log("folder search with navigationpath error");
      res.sendStatus(500);
    }
  } else {
    //filter the content.json file for all folders
    console.log("here in else")
    try {
      const folderSearch = jmespath.search(content, "folders");
      res.send(folderSearch);
    } catch (error) {
      console.log(error + " folder search error");
      res.sendStatus(500);
    }
  }
});

/*
Example search queries to support
1. images?navigationPath=&pageNumber=1                      get all images in the root folder - this is the default query Tempalfy opens with. If no folders, this should return all images. If folders, don't return images.
2. images?navigationPath=100&pageNumber=1                   get images from folder 100
3. images?navigationPath=100%2F103&pageNumber=1             this is the navigation path for the folder with id 100/103
4. images?navigationPath=&searchQuery=flower&pageNumber=1   this is the search query for a flower
*/

//image requests
app.get("/images", (req, res) => {
  console.log("requested images with " + req.query);

  for (const key in req.query) {
    console.log(key, req.query[key])
  }

  //support search queries
  const imageSearchQuery = req.query.searchQuery; //what to search for
  const pageNumber = req.query.pageNumber; //support pagination

  let navigationPath = req.query.navigationPath; //which folder to search
    if ( navigationPath.endsWith("/")) {
      navigationPath = navigationPath.slice(0, -1);
    }

  if (!navigationPath && imageSearchQuery === undefined) {
    //1. images?navigationPath=&pageNumber=1
    try {
      const imageSearch = jmespath.search(content, "images");
      res.send(imageSearch);
    } catch (error) {
      console.log(error + " 1st image search error");
      res.sendStatus(500);
    }
  } else if (navigationPath && navigationPath !== undefined) {
    //2. images?navigationPath=100&pageNumber=1 find all images in the navigation path
    console.log("here on 91");

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
    //images?searchQuery=flower&pageNumber=1
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

app.listen(PORT, () => {
  console.log(`Express server currently running on port ${PORT}`);
});
