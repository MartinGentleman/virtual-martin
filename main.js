const express = require ('express');
const session = require ('express-session');
const path = require ('path');
const bodyParser = require ('body-parser');
const AI = require ('./src/ai');
const PORT = process.env.PORT || 5000;
const app = express ();
const router = express.Router ();
const mongoose = require ('mongoose');
const MongoStore = require ('connect-mongo')(session);
const VisitorModel = require ('./src/visitor-model');
const ConversationModel = require ('./src/conversation-model');

mongoose
  .connect (process.env.MONGODB_URI)
  .catch (err => console.error ('ERROR: MongoDB connection error.', err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'virtual-martin-session',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

app
  .use(bodyParser.urlencoded ({ extended: true }))
  .use(bodyParser.json ());

app
  .use(express.static (path.join (__dirname, 'public')))
  .set('views', path.join (__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render ('pages/index'));

const saveConversationData = (result, session) =>
  new ConversationModel ({
    sessionID: session.AISessionID,
    query: result.queryText,
    response: result.fulfillmentText ? result.fulfillmentText : '',
    intent: result.intent ? result.intent.displayName : '',
    parameters: result.parameters.fields
  }).save ()
    .catch (err => console.error (err));

const saveVisitorData = (result, session) => {
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
      VisitorModel.findOneAndUpdate (
        { sessionID: session.AISessionID },
        visitor,
        { upsert:true }
      ).catch (err => console.error (err));
    }
  }
};

router.route ('/query')
  .post ((req, res) => {
    AI.sendQuery (req.body.message, req.session).then (responses => {
      const result = responses[0].queryResult;
      saveConversationData (result, req.session);
      saveVisitorData (result, req.session);
      const response = {
        "query": result.queryText,
        "response": result.fulfillmentText ? result.fulfillmentText : 'hmm...'
      };
      if (process.env.NODE_ENV === 'dev') response ['payload'] = responses;
      res.json (response);
    }).catch (err => {
      console.error (err);
      res.json ({
        "query": req.body.message,
        "response": "That's awkward... I am experiencing a bit of a server problem. The real Martin is being notified of that."
      });
    });
  });

app.use('/api', router);

// redirect everything else to homepage
app.use ((req, res) => {
  res.redirect ('/');
});

app.listen (PORT, () => console.log(`Listening on ${ PORT }`));
