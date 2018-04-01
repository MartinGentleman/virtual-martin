const projectId = 'job-interview-d8e97';
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const getRequest = query => ({
  session: sessionPath,
    queryInput: {
    text: {
      text: query,
        languageCode: languageCode,
    },
  },
});

const sendQuery = query => sessionClient.detectIntent(getRequest(query));

module.exports = {
  sendQuery: sendQuery
};