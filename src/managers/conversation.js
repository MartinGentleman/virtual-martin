const Model = require ('../models/conversation-model');

const saveData = (result, session) =>
  new Model ({
    sessionID: session.AISessionID,
    query: result.queryText,
    response: result.fulfillmentText ? result.fulfillmentText : '',
    intent: result.intent ? result.intent.displayName : '',
    parameters: result.parameters.fields
  }).save ()
  .catch (err => console.error (err));

const count = async () => Model.count ({});

module.exports = {
  saveData: saveData,
  count: count
};