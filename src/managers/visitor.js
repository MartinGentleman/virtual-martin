const Model = require ('../models/visitor-model');

const saveData = (result, session) => {
  if (result.intent) {
    const fields = result.parameters.fields;
    if (result.intent.displayName === 'Get Name') {
      const visitor = {};
      if (fields ['given-name'] && fields ['given-name'].stringValue) {
        visitor.firstName = fields ['given-name'].stringValue;
        console.log(`${session.AISessionID}: first name ${fields ['given-name'].stringValue}.`);
      }
      if (fields ['last-name'] && fields ['last-name'].stringValue) {
        visitor.lastName = fields ['last-name'].stringValue;
        console.log(`${session.AISessionID}: last name ${fields ['last-name'].stringValue}.`);
      }
      Model.findOneAndUpdate (
        { sessionID: session.AISessionID },
        visitor,
        { upsert: true }
      ).catch (err => console.error (err));
    }
  }
};

const count = async () => Model.count ({});

const paginate = async (limit, skip) => Model.find ({}).limit (limit).skip (skip).lean ().exec ();

module.exports = {
  saveData,
  count,
  paginate
};