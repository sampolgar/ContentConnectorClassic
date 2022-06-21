const express = require("express");
const content = require("./content.json");
const jmespath = require("jmespath");

const app = express();
const PORT = 3000;
app.use(express.json());

//oauth request
app.post("/oauth2/token", (req, res) => {
  //authenticate
  const tokenResponse = {
    access_token: "fake_token",
    expires_in: "3600",
    token_type: "Bearer",
  };
  res.send(tokenResponse);
});

//folder requests
app.get("/folders", (req, res) => {
  //get the navigation path
  let navigationPath = req.query.navigationPath;
  let parsedNavPath = navigationPathParser(navigationPath);
  console.log("parsednavpath: " + parsedNavPath);

  if (parsedNavPath === "emptyNavPath") {
    //find the root folder and send it back to Templafy
    try {
      const jmespathExpression = `min_by(folders, &id)`;
      const folderSearch = [jmespath.search(content, jmespathExpression)];
      res.send(folderSearch);
    } catch (error) {
      console.log(error + " root folder error");
      res.sendStatus(500);
    }
  } else {
    //display the subfolders
    try {
      const jmespathExpression = `folders[?parentFolderId=='${parsedNavPath}']`;
      const folderSearch = jmespath.search(content, jmespathExpression);
      res.send(folderSearch);
    } catch {
      console.log(error + " folder search error");
      res.sendStatus(500);
    }
  }
});

//image requests
app.get("/images", (req, res) => {
  const imageSearchQuery = req.query.searchQuery; //what to search for
  const pageNumber = req.query.pageNumber; //support pagination - pageNumber always starts at 1
  const pageSize = req.query.pageSize; // page size is always 30

  let navigationPath = req.query.navigationPath; //which folder to search
  let parsedNavPath = navigationPathParser(navigationPath);

  console.log(imageSearchQuery + "searchqery");
  if (imageSearchQuery !== undefined && parsedNavPath === "emptyNavPath") {
    //search for images with the search query
    try {
      const currentSearchQuery = imageSearchQuery.toLowerCase();
      //search image name and tags for the search query
      const jmespathExpression = `images[?imagename.contains(@, '${currentSearchQuery}') || tags.contains(@, '${currentSearchQuery}')]`;
      const imageSearch = jmespath.search(content, jmespathExpression);
      res.send(imageSearch);
    } catch (error) {
      console.log(error + " image search error");
      res.sendStatus(500);
    }
  } else if (
    imageSearchQuery !== undefined &&
    parsedNavPath !== "emptyNavPath"
  ) {
    //search for images with the image search query in the specified folder
    try {
      const currentSearchQuery = imageSearchQuery.toLowerCase();
      const jmespathExpression = `images[?folderId=='${parsedNavPath}' && imagename.contains(@, '${currentSearchQuery}') || tags.contains(@, '${currentSearchQuery}')]`;
      const imageSearch = jmespath.search(content, jmespathExpression);
      res.send(imageSearch);
    } catch {
      console.log(error + " image and folder search error");
      res.sendStatus(500);
    }
  } else if (parsedNavPath === "emptyNavPath") {
    //return an empty array. Unless you have no folders, then return all images
    try {
      const imageArry = [];
      res.send(imageArry);
    } catch (error) {
      console.log(error + " 1st image search error");
      res.sendStatus(500);
    }
  } else if (parsedNavPath.length > 0) {
    //search for all images in the selected folder
    try {
      const imageJmesPathExpression = `images[?folderId=='${parsedNavPath}']`;
      const imageSearch = jmespath.search(content, imageJmesPathExpression);
      res.send(imageSearch);
    } catch (error) {
      console.log(error + "searching images in a folder");
      res.sendStatus(500);
    }
  }
});

//download request
app.get("/images/:imgid", (req, res) => {
  const imageId = req.params.imgid;
  try {
    const jmespathExpression = `images[?id=='${imageId}'].previewUrl | [0]`;
    const imageDownloadSearch = jmespath.search(content, jmespathExpression);
    downloadObj = {
      downloadUrl: imageDownloadSearch,
    };
    res.send(downloadObj);
  } catch (error) {
    console.log(error + " downloading image error");
    res.sendStatus(500);
  }
});

//navigation Path Parser
function navigationPathParser(navigationPath) {
  // strip the ending slash
  if (navigationPath.endsWith("/")) {
    navigationPath = navigationPath.slice(0, -1);
  }
  //check if navpath is empty
  if (navigationPath === "") {
    return "emptyNavPath";
  } else {
    //return the parentId of the selected folder
    console.log("navpathsplit: " + navigationPath.split("/").at(-1));
    return navigationPath.split("/").at(-1);
  }
}

app.listen(PORT, () => {
  console.log(`Express server currently running on port ${PORT}`);
});
