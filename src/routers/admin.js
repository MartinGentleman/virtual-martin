const router = require ('express').Router ();
const paginate = require ('express-paginate');
const md5 = require ('md5');
const Conversation = require ('../managers/conversation');
const Visitor = require ('../managers/visitor');
const AIResponse = require ('../managers/ai-response');

router.use (paginate.middleware (10, 50));

router.use ((req, res, next) =>
  req.originalUrl !== '/admin' && !req.session.isAdmin ? res.redirect ('/') : next ());

router.route ('/')
  .get ((req, res) => req.session.isAdmin ? res.redirect ('/admin/index') : res.render ('pages/admin-login', { failed: false }))
  .post ((req, res) => {
    if (md5 (req.body.password) === process.env.PASSWORD_MD5) {
      req.session.isAdmin = true;
      res.redirect ('/admin/index');
    } else {
      console.info (`SECURITY ERROR: wrong password '${req.body.password}' from ${req.ip}.`);
      res.render ('pages/admin-login', { failed: true  });
    }
  });

router.route ('/log-out')
  .get ((req, res) => {
    req.session.isAdmin = false;
    res.redirect ('/');
  });

router.route ('/index')
  .get (async (req, res) => {
    const [
      numberOfVisitors,
      numberOfConversations] =
        await Promise
          .all ([
            Visitor.count (),
            Conversation.count ()
          ]);
    res.render ('pages/admin-index',
      {
        numberOfVisitors,
        numberOfConversations
      });
  });

const paginateRoute = render => manager => async (req, res) => {
  const [ model, modelCount ] = await Promise.all([
    manager.paginate (req.query.limit, req.skip),
    manager.count ()
  ]);

  const pageCount = Math.ceil (modelCount / req.query.limit);

  res.render (render, {
    model,
    modelCount,
    pageCount,
    pages: paginate.getArrayPages (req) (3, pageCount, req.query.page)
  });
};

router.route ('/visitors').get (paginateRoute ('pages/admin-visitors') (Visitor));

router.route ('/conversations').get (paginateRoute ('pages/admin-conversations') (Conversation));

router.route ('/ai-responses').get (paginateRoute ('pages/admin-ai-responses') (AIResponse));

module.exports = router;