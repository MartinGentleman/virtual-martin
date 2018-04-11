# Virtual Martin
*Artificial Intelligence project of Martin Novak*

Virtual Martin is artificial intelligence using language processing to create a chatbot to allow visitors to chat.

# Technologies

The project itself has been created to use Heroku and Google Dialogflow.

# Setup

With heroku you start the application by *heroku local* using the Heroku CLI

Without heroku you can run *npm start* which also takes care of loading local .env file

For session management and data you will need to connect your application with MongoDB

# .env

You have to create *.env* file with this content and same has to be setup on production or heroku end

NODE_ENV=dev
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
CV_DOWNLOAD=
DEFAULT_WELCOME=Hello World
GOOGLE_TRACKING_ID=UA-XXXX-1
SESSION_SECRET=I am ever so secret
MONGODB_URI=