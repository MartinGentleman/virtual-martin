const dialogflow = require ('dialogflow');

const sessionClient = new dialogflow.SessionsClient({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace (/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL
  }
});

const getRequest = (query, sessionID) => ({
  session: sessionID,
    queryInput: {
    text: {
      text: query,
        languageCode: 'en-US',
    },
  },
});

const logStartOfSession = variable => console.log (`New session: ${variable}`) || variable;

const getSessionID = sessionID => sessionClient.sessionPath (process.env.GOOGLE_PROJECT_ID, sessionID);

const sessionIDFromBrowserSession = session =>
  session.AISessionID ?
    session.AISessionID :
    logStartOfSession (session.AISessionID = `node-${Date.now ()*Math.random ()}`);

const sendQuery = (query, session) =>
  sessionClient.detectIntent (getRequest (query, getSessionID (sessionIDFromBrowserSession (session))));

module.exports = {
  sendQuery
};