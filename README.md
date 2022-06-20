# Templafy Classic Content Connector Template

## How to use this template?
This template includes the routes and responses required to interact with the Templafy Classic Custom Connector.

In the [content.json](https://github.com/sampolgar/ContentConnector/blob/main/content.json) file, I've included a list of folders and images to be used for this template.
Feel free to update that list to include your own images and folders.

The 4 routes required are detailed in the article [here](https://support.templafy.com/hc/en-us/articles/4409277248273-How-to-build-a-Classic-Custom-Content-Connector-API-).
I've included [sample cURL requests](https://github.com/sampolgar/ContentConnector#curl-requests) to mirror what Templafy sends to your connector. The responses below are what this project sends back to Templafy.

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

# 1 - download and run locally
1. cd to the folder containing this template e.g. cd ~/templafy-classic-content-connector-template
2. run git clone  https://github.com/sampolgar/ContentConnector.git
3. run `npm install`
4. run `node index.js`
5. open http://localhost:3000/

# 2 - test locally
use postman to query the API
1. POST http://localhost:3000/oauth2/token
2. GET http://localhost:3000/folders
3. GET http://localhost:3000/images/navigationPath=&pageNumber=1
4. GET http://localhost:3000/images/1001/

# 3 - test online
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
- [x] sample curl requests
- [ ] support pagination
- [ ] include postman collection in github repo



# cURL requests

## oauth2/token
**Request**
```
curl -X POST \
  -H "host":"68e0-220-233-33-78.au.ngrok.io" \
  -H "content-type":"application/x-www-form-urlencoded"
  -H "content-length":"99"
  -H "traceparent":"00-dfe1bbe7333246538129fd1976df6bf9-0a33d1ab5696171c-01" \
  -H "x-forwarded-proto":"https" \
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  -d "grant_type=client_credentials" \
  -d "client_secret=clientSecretFromTemplafy" \
  -d "client_id=clientIdFromTemplafy" \
  "https://68e0-220-233-33-78.au.ngrok.io/oauth2/token"
  ```

**Response - oauth token is valid**
```
Content-Length: 71
Content-Type: application/json; charset=utf-8
Date: Mon, 20 Jun 2022 03:03:04 GMT
Etag: W/"47-pmPeHdyyEDqCsvl5R4sx/lA70Pc"
Ngrok-Trace-Id: dfe1bbe7333246538129fd1976df6bf9
X-Powered-By: Express

{"access_token":"fake_token","expires_in":"3600","token_type":"Bearer"}
```

**Response - oauth token is invalid**
```
HTTP/1.1 401 Unauthorized
Content-Length: 12
Content-Type: text/plain; charset=utf-8
Date: Mon, 20 Jun 2022 03:39:45 GMT
Etag: W/"c-dAuDFQrdjS3hezqxDTNgW7AOlYk"
Ngrok-Trace-Id: dfe1bbe7333246538129fd1976df6bf9
X-Powered-By: Express

Unauthorized
```


## Folder
**Request**
```
curl -X GET \
  -H "host":"68e0-220-233-33-78.au.ngrok.io" \
  -H "authorization":"Bearer fake_token" \
  -H "traceparent":"00-dfe1bbe7333246538129fd1976df6bf9-0a33d1ab5696171c-01" \
  -H "x-forwarded-for":"20.193.37.124" \
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  "https://68e0-220-233-33-78.au.ngrok.io/folders?libraryId=Asset&navigationPath=100%2F103"
```

**Response**
```
HTTP/1.1 200 OK
Content-Length: 87
Content-Type: application/json; charset=utf-8
Date: Mon, 20 Jun 2022 03:09:37 GMT
Etag: W/"57-3WkFM/l6+x5A1GnaJrArGv7n2eA"
Ngrok-Trace-Id: dfe1bbe7333246538129fd1976df6bf9
X-Powered-By: Express

[{"id":"104","name":"Fine Wine","navigationPath":"100/103/104","parentFolderId":"103"}]
```

## Images
**Request**
```
curl -X GET \
  -H "host":"68e0-220-233-33-78.au.ngrok.io" \
  -H "authorization":"Bearer fake_token" \
  -H "traceparent":"00-dfe1bbe7333246538129fd1976df6bf9-0a33d1ab5696171c-01" \
  -H "x-forwarded-for":"20.193.37.124" \
  -H "x-forwarded-proto":"https"
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  "https://68e0-220-233-33-78.au.ngrok.io/images?navigationPath=104&pageNumber=1&pageSize=30"
```
**Response**
```
HTTP/1.1 200 OK
Content-Length: 499
Content-Type: application/json; charset=utf-8
Date: Mon, 20 Jun 2022 03:36:43 GMT
Etag: W/"1f3-9lpBJCibo2S0uVXxfMUukVuYLdo"
Ngrok-Trace-Id: dfe1bbe7333246538129fd1976df6bf9
X-Powered-By: Express

[{"folderId":"104","id":"1013","height":100,"width":100,"mimeType":"image/jpeg","previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Wine3.jpg","imagename":"red burgundy bottle 1","tags":"drink"},{"folderId":"104","id":"1014","height":100,"width":100,"mimeType":"image/jpeg","previewUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Wine4.jpg","imagename":"red burgundy bottle 2","tags":"drink"}]
```

## Image Download
**Request**
```
 curl -X GET \
  -H "host":"68e0-220-233-33-78.au.ngrok.io" \
  -H "authorization":"Bearer fake_token" \
  -H "traceparent":"00-dfe1bbe7333246538129fd1976df6bf9-0a33d1ab5696171c-01" \
  -H "x-forwarded-for":"20.193.37.124" \
  -H "x-forwarded-proto":"https"
  -H "x-templafyuser":"spo@templafy.com" \
  -H "accept-encoding":"gzip" \
  "https://68e0-220-233-33-78.au.ngrok.io/images/1004"
```

**Response**
```
HTTP/1.1 200 OK
Content-Length: 120
Content-Type: application/json; charset=utf-8
Date: Mon, 20 Jun 2022 03:01:03 GMT
Etag: W/"78-fkQm2+2ibGE9OE3Gc2iZnesicVQ"
Ngrok-Trace-Id: dfe1bbe7333246538129fd1976df6bf9
X-Powered-By: Express

{"downloadUrl":"https://templafydownload.blob.core.windows.net/delivery/Integrations/ContentConnector-Images/Food4.jpg"}
```