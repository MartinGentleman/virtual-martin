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
      res.json ({
        "query": result.queryText,
        "response": result.fulfillmentText
      });
    }).catch(err => {
      res.json ({
        "query": req.body.message,
        "response": "Can you tell me more?"
      });
    });
  });

app.use('/api', router);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
