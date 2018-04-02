const projectId = 'job-interview-d8e97';
const sessionId = 'quickstart-session-id';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');

const sessionClient = new dialogflow.SessionsClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL
  }
});

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const getRequest = query => ({
  session: sessionPath,
    queryInput: {
    text: {
      text: query,
        languageCode: 'en-US',
    },
  },
});

const sendQuery = query => sessionClient.detectIntent(getRequest(query));

module.exports = {
  sendQuery: sendQuery
};