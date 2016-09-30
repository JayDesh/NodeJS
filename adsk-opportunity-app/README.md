
# adsk-opportunity-app

REST endpoints for retrieving opportunity data from Salesforce.com through HerokuConnect.

## Endpoint definitions
Browse the API here: <https://adsk-opportunity-app-dev.herokuapp.com/explorer/>
The following endpoints are supported:
- [Get Opportunity by Opportunity / Agreement](https://adsk-opportunity-app-dev.herokuapp.com/explorer/#!/service/findByOpportunityNumber)
- [Get Opportunities by Agreement](https://adsk-opportunity-app-dev.herokuapp.com/explorer/#!/service/findByAgreementNumber)

## OAuth 2 Authorization
To connect to these endpoints, you will need an oauth2 token. Please follow these steps:

1. Obtain an access token: <https://adsk-oauth2-app-dev.herokuapp.com/oauth2/token?grant_type=client_credentials&client_id=3a1c847fc0f2afb2e84e9875af630ade&client_secret=32fe0e8e9e3b8274b47e65dcf7de14ec08a42321>
  1. Your token is in the "id" field.
  2. NOTE: the client_id and client_secret listed above are for development purposes only, and are subject to change.
2. Embed the access token in your request to this app:
  1. Open [Postman](https://www.getpostman.com/) in Chrome.
  2. Paste the API call into the URL field. For example: https://adsk-opportunity-app-dev.herokuapp.com:443/api/service/v1/opportunity
  3. Select "POST" from the method pulldown
  4. Click the "Headers" tab to open headers.
  5. Header: Authorization
  6. Value: Bearer YOUR_TOKEN_ID_FROM_THE_OAUTH_SERVER
  7. Click the "Body" select "Raw" and "JSON(application/json)"
  8. Paste 
    
    #For retrieving opportunity based on agreement number
  		{
		"opportunity":"",
		"agreement":"110000330137"
		}
	#For retrieving opportunity based on opportunity number
  		{
		"opportunity":"A-4732983",
		"agreement":""
		}
  7. Click "Send"

## Environment Variables

Environment variables are configured through the [heroku config:set](https://devcenter.heroku.com/articles/config-vars) command (please follow the link for details). The following environment variables are used by this application:

- **DATABASE_URL**: PostgreSQL connection string for the master database.
- **CLUSTER_DB**: "DATABASE_URL"




=======
# adsk-opportunity-app

