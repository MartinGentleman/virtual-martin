# Virtual Martin
*Artificial Intelligence project of Martin Novak*

Virtual Martin is artificial intelligence using language processing to create a chatbot to allow visitors to chat.

# Technologies

Everything is being tested on desktop using latest Chrome, Safari, Firefox, Edge and IE11. On mobile devices I use
iPhone, iPad, iPad Pro and emulators. The CSS layout itself is responsive.

The server backend is developed in Node.js JavaScript using ES6 features and couple approaches from functional
programming including composition and currying. For browser Babel is used for transpilation and JavaScript is bundled
into a single file.

The cool animation in the background is created using pure SVG. Best support is in Chrome. Because Edge, IE and Firefox
are all slow with such large background, the animation is turned off there and only static background is generated.
Safari supports the animation but has trouble with blur filter. Your Android and Apple devices should run it ok.

Sessions and various visitor and conversation tracking are stored in MongoDB.

The project itself has been created to use Heroku and Google Dialogflow. Heroku is optional but recommended.

# Setup

With heroku you start the application by *heroku local* using the Heroku CLI.

Without heroku you can run *npm start* which also takes care of loading local .env file.

For session management and data you will need to connect your application with MongoDB.

# .env

You have to create *.env* file with this content and same has to be setup on production or heroku end:

NODE_ENV=dev

GOOGLE_PROJECT_ID=

GOOGLE_PRIVATE_KEY=

GOOGLE_CLIENT_EMAIL=

CV_DOWNLOAD=

DEFAULT_WELCOME=Hello World

GOOGLE_TRACKING_ID=UA-XXXX-1

SESSION_SECRET=I am ever so secret

MONGODB_URI=