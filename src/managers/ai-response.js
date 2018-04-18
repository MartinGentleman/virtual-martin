const Model = require ('../models/ai-response-model');

const saveData = data =>
  Model.findOneAndUpdate (
    { topic: data.topic },
    data,
    { upsert: true }
  ).catch (err => console.error (err));

const count = async () => Model.count ({});

const paginate = async (limit, skip) => Model.find ({}).limit (limit).skip (skip).lean ().exec ();

const findByTopic = async topic => Model.findOne ({ topic: topic }).lean ().exec ();

module.exports = {
  saveData,
  count,
  paginate,
  findByTopic
};