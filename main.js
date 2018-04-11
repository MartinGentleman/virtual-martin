const express = require ('express');
const compression = require ('compression');
const session = require ('express-session');
const path = require ('path');
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const MongoStore = require ('connect-mongo') (session);
const api = require ('./src/routers/api.js');

const PORT = process.env.PORT || 5000;
const app = express ();

mongoose
  .connect (process.env.MONGODB_URI)
  .catch (err => console.error ('ERROR: MongoDB connection error.', err));

app.use (session ({
  secret: process.env.SESSION_SECRET,
  name: 'virtual-martin-session',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: true
}));


app.use (compression());

app
  .use (bodyParser.urlencoded ({ extended: true }))
  .use (bodyParser.json ());

app
  .use (express.static (path.join (__dirname, 'public')))
  .set ('views', path.join (__dirname, 'views'))
  .set ('view engine', 'ejs')
  .get ('/', (req, res) => res.render ('pages/index'));

app.use ('/api/v1', api);

if (process.env.NODE_ENV === 'dev') {
  const paginate = require('express-paginate');
  const admin = require ('./src/routers/admin');

  app.use (paginate.middleware (10, 50));
  app.use ('/admin', admin);
}

// redirect everything else to homepage
app.use ((req, res) => {
  res.redirect ('/');
});

app.listen (PORT, () => console.log (`Listening on ${ PORT }`));
