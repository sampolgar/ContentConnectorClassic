# Templafy Classic Content Connector Template

## How to use this template?
This template includes the routes and responses required to interact with the Templafy Classic Custom Connector.

The 4 routes required are detailed in the article [here](https://support.templafy.com/hc/en-us/articles/4409277248273-How-to-build-a-Classic-Custom-Content-Connector-API-)

1. POST https://example.com/oauth2/token
2. GET https://example.com/folders
3. GET https://example.com/images
4. GET https://example.com/images/{assetId}

### Instructions
1. Fork the template
2. Run locally
3. Test locally
4. Deploy to Azure
5. Configure in Templafy Custom Content Connector

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


## Links
- https://support.templafy.com/hc/en-us/articles/4409277248273-How-to-build-a-Classic-Custom-Content-Connector-API- 