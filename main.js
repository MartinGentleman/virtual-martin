const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const AI = require('./ai');
const PORT = process.env.PORT || 5000;
const app = express();
const router = express.Router();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json());

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'));

router.route('/query')
  .post ((req, res) => {
    AI.sendQuery (req.body.message).then (responses => {
      const result = responses[0].queryResult;
      const response = {
        "query": result.queryText,
        "response": result.fulfillmentText ? result.fulfillmentText : 'hmm...'
      };
      if (process.env.NODE_ENV === 'dev') response['payload'] = responses;
      res.json (response);
    }).catch (err => {
      res.json ({
        "query": req.body.message,
        "response": "That's awkward... I am experiencing a bit of a server problem. The real Martin is being notified of that."
      });
    });
  });

app.use('/api', router);

// redirect everything else to homepage
app.use((req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
