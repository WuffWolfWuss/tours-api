# tours-api
<h4 align="center">An tour booking backend api using <a href="https://nodejs.org/en/" target="_blank">NodeJS</a>.</h4>

## Project architecture
![Architecture](https://github.com/WuffWolfWuss/tours-api/blob/main/dev-data/data/tour-architecture.jpg)

## Key Features

* Authentication and Authorization with JWT token
  - Signup
  - Login/logout
  - Reset password using Nodemailer
* Tour
  - Manage tour details
  - Check users' reviews and rating
* User profile
  - Update username, photo, email, and password
 
 
## Build With

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [JSON Web Token](https://jwt.io/) - Security token
* [Postman](https://www.getpostman.com/) - API testing
* [Mailtrap](https://mailtrap.io/) - Email delivery platform

## Installation
You can fork the app or you can git-clone the app into your local machine. Once done that, please install all the
dependencies by running
```
$ npm i

set your .env variables:
PORT = <Local Port>
MONGO_URL = mongodb+srv://<username>:<password>@cluster0.qxzxpg4.mongodb.net/<database-name>?retryWrites=true&w=majority
NODE_ENV = development

JWT_KEY = <random key for generate jwt>
JWT_EXPIRES_TIME= <time for JWT token expires>
JWT_COOKIES_EXPRIES = <time for cookies expires>

#this env is for testing reset password via mail
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_USERNAME=<enter mailtrap username>
EMAIL_PASSWORD=<enter mailtrap password>
EMAIL_PORT=587 

$ npm start (for development)
$ npm run start:prod (for production)
```

##API Testing

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/21641871-3c30ca6a-794d-4307-80f9-ef3076da4e9e?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D21641871-3c30ca6a-794d-4307-80f9-ef3076da4e9e%26entityType%3Dcollection%26workspaceId%3D9f9f0a6c-69cc-4aa6-8773-978a5714d9d6#?env%5BDev%3ATours%5D=W3sia2V5IjoiVVJMIiwidmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJzZXNzaW9uSW5kZXgiOjB9LHsia2V5Ijoiand0IiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiYW55Iiwic2Vzc2lvblZhbHVlIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBaQ0k2SWpZMFlUWmhaVEptTXpnMlkyVTVaVEUwTWpBeE9EVTBNaUlzSW1saGRDSTZNVFk0T0RZME5URTNNU3dpWlhod0lqb3hOamt4TWpNM01UY3hmUS5heEl3cTU0QlUuLi4iLCJzZXNzaW9uSW5kZXgiOjF9XQ==)
* Some of the API require 'admin' roles to access, signup with role 'admin' to test all api

 
  
 
  
