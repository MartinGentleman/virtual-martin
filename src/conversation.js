const ConversationModel = require ('./conversation-model');

const saveData = (result, session) =>
  new ConversationModel ({
    sessionID: session.AISessionID,
    query: result.queryText,
    response: result.fulfillmentText ? result.fulfillmentText : '',
    intent: result.intent ? result.intent.displayName : '',
    parameters: result.parameters.fields
  }).save ()
  .catch (err => console.error (err));

module.exports = {
  saveData: saveData
};