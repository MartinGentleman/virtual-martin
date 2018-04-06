const router = require ('express').Router ();
const Conversation = require ('../managers/conversation');
const Visitor = require ('../managers/visitor');

router.route ('/')
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
        numberOfVisitors: numberOfVisitors,
        numberOfConversations: numberOfConversations
      });
  });

module.exports = router;