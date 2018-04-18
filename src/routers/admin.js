const router = require ('express').Router ();
const paginate = require ('express-paginate');
const md5 = require ('md5');
const Conversation = require ('../managers/conversation');
const Visitor = require ('../managers/visitor');
const AIResponse = require ('../managers/ai-response');

// router.use ((req, res, next) => !req.session.isAdmin ? res.redirect ('/') : next ());

router.route ('/')
  .get ((req, res) => res.render ('pages/admin-login'))
  .post ((req, res) => {
    if (md5 (req.body.password) === process.env.PASSWORD_MD5) {
      req.session.isAdmin = true;
      res.redirect ('/index');
    } else {
      res.render ('pages/admin-login', {
        failed: true
      });
    }
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

router.route ('/visitors')
  .get (async (req, res) => {
    const [ visitors, visitorCount ] = await Promise.all([
      Visitor.paginate (req.query.limit, req.skip),
      Visitor.count ()
    ]);

    const pageCount = Math.ceil (visitorCount / req.query.limit);

    res.render ('pages/admin-visitors', {
      visitors,
      visitorCount,
      pageCount,
      pages: paginate.getArrayPages (req) (3, pageCount, req.query.page)
    });
  });

router.route ('/conversations')
  .get (async (req, res) => {
    const [ conversations, conversationCount ] = await Promise.all([
      Conversation.paginate (req.query.limit, req.skip),
      Conversation.count ()
    ]);

    const pageCount = Math.ceil (conversationCount / req.query.limit);

    res.render ('pages/admin-conversations', {
      conversations,
      conversationCount,
      pageCount,
      pages: paginate.getArrayPages (req) (3, pageCount, req.query.page)
    });
  });

router.route ('/ai-responses')
  .get (async (req, res) => {
    const [ responses, responseCount ] = await Promise.all([
      AIResponse.paginate (req.query.limit, req.skip),
      AIResponse.count ()
    ]);

    const pageCount = Math.ceil (responseCount / req.query.limit);

    res.render ('pages/admin-ai-responses', {
      responses,
      responseCount,
      pageCount,
      pages: paginate.getArrayPages (req) (3, pageCount, req.query.page)
    });
  });

module.exports = router;