const router = require ('express').Router ();
const AI = require ('../ai');
const Visitor = require ('../managers/visitor');
const Conversation = require ('../managers/conversation');

router.route ('/query')
  .post ((req, res) =>
    AI
    .sendQuery (req.body.message, req.session)
    .then (responses => {
      const result = responses[0].queryResult;
      Conversation.saveData (result, req.session);
      Visitor.saveData (result, req.session);
      const response = {
        "query": result.queryText,
        "response": result.fulfillmentText ? result.fulfillmentText : 'hmm...'
      };
      if (process.env.NODE_ENV === 'dev') response ['payload'] = responses;
      res.json (response);
    })
    .catch (err => {
      console.error (err);
      res.json ({
        "query": req.body.message,
        "response": "That's awkward... I am experiencing a bit of a server problem. The real Martin is being notified of that."
      });
    })
  );

module.exports = router;