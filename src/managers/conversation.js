const Model = require ('../models/conversation-model');

const saveData = result => request =>
  new Model ({
    sessionID: request.session.AISessionID,
    query: result.queryText,
    response: result.fulfillmentText ? result.fulfillmentText : '',
    intent: result.intent ? result.intent.displayName : '',
    parameters: result.parameters.fields
  }).save ()
  .catch (err => console.error (err));

const count = async () => Model.count ({});

const paginate = async (limit, skip) => Model.find ({}).limit (limit).skip (skip).lean ().exec ();

module.exports = {
  saveData,
  count,
  paginate
};