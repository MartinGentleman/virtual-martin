const geoip = require ('geoip-lite');
const Model = require ('../models/visitor-model');
const __ = require ('../utilities/utilities');

const saveData = result => request => {

  const fields = result.parameters.fields;
  let visitor = {};

  if (!request.session.visitor) {
    const ip = request.headers ['x-forwarded-for'] || request.connection.remoteAddress;
    const geo = geoip.lookup (ip);
    visitor = {
      ip: ip,
      userAgent: request.headers ['User-Agent'],
      country: geo.country,
      region: geo.region,
      city: geo.city
    }
  } else {
    visitor = request.session.visitor;
  }

  if (result.intent) {
    if (fields ['given-name'] && fields ['given-name'].stringValue) {
      visitor.firstName = fields ['given-name'].stringValue;
    }
    if (fields ['last-name'] && fields ['last-name'].stringValue) {
      visitor.lastName = fields ['last-name'].stringValue;
    }
  }

  if (!__.isObjectEqual (request.session.visitor) (visitor)) {
    Model.findOneAndUpdate (
      { sessionID: request.session.AISessionID },
      visitor,
      { upsert: true }
    )
    .then (() => request.session.visitor = visitor)
    .catch (err => console.error (err));
  }
};

const count = async () => Model.count ({});

const paginate = async (limit, skip) => Model.find ({}).limit (limit).skip (skip).lean ().exec ();

module.exports = {
  saveData,
  count,
  paginate
};