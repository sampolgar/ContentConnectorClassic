# Templafy Classic Content Connector Template

## How to use this template?
This template includes the routes and responses required to interact with the Templafy Classic Custom Connector.

The 4 routes required are detailed in the article [here](https://support.templafy.com/hc/en-us/articles/4409277248273-How-to-build-a-Classic-Custom-Content-Connector-API-)

1. POST https://example.com/oauth2/token
2. GET https://example.com/folders
3. GET https://example.com/images
4. GET https://example.com/images/{assetId}

## Description
- Each page load from within Templafy will query both folders and images
- The custom connector needs to support a navigationPath query parameter to return a list of folders and images at a given path
- E.g. folders?navigationPath=100/101 will return the folders at the path 100/101 or the subfolders of folder 101
- images?navigationPath=100/101 will return the images at the path 100/101 or images for folder 101

### Instructions
1. Fork the template
2. Run locally
3. Test locally
4. Deploy to Azure
5. Configure in Templafy Custom Content Connector

# 1 - download this template

# 2 - run locally
1. cd to the folder containing this template e.g. cd ~/templafy-classic-content-connector-template
2. run `npm install`
3. run `node index.js`
4. open http://localhost:3000/

# 3 - test locally
use postman to query the API
1. POST http://localhost:3000/oauth2/token
2. GET http://localhost:3000/folders
3. GET http://localhost:3000/images/navigationPath=&pageNumber=1
4. GET http://localhost:3000/images/1001/

# 4 - test online
1. install [ngrok](https://ngrok.com/)
2. run setup instructions from [ngrok](https://ngrok.com/)
3. run `ngrok http 3000`

# 4 - configure in Templafy Custom Content Connector settings page

# 5 - deploy to Cloud Infrastructure
## Example - Azure Cloud Service
1. create an Azure Web App (Node 16)
2. Press Get Publish Profile and copy all text
3. In github go to Settings > Secrets
4. Create a new secret secrets.AZUREAPPSERVICE_PUBLISHPROFILE , and paste the text from Get Publish Profile
5. Open .github/workflows/deploy_main_to_azure_web_app.yml to adjust the app-name to match the name of your Azure Web App

## To Do
- [x] respond to POST oAuth request
- [x] respond to GET folder request with []
- [x] respond to GET image request with image JSON
- [x] support folder
- [x] support folder request with navigationPath e.g. folders?navigationPath=100/101
- [x] support image request with dynamic image list
- [x] support navigation path folder structure
- [ ] support pagination
- [ ] include postman collection in github repo