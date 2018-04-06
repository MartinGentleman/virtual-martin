{
  const editableMessage =
    `<div class="message">
       <div class="arrow">></div>
       <div class="text" contenteditable="true"></div>
       <div class="send">[ Send ]</div>
     </div>`;

  const newResponse =
    `<div class="message ai">
        <div class="text"><span class="typing"></span></div>
     </div>`;

  const focus = target => setTimeout (() => target.focus (), 0);

  const scrollToBottom = target => target.scrollTop = target.scrollHeight && target;
  const scrollToBottomOfMessages = () => scrollToBottom ($ ('#messages').get (0));

  const turnOffAllContenteditable = () => $ ('[contenteditable=true]').attr ('contenteditable', 'false');

  const askAI = message => $.post ('/api/query', {message: message});

  const logDebugResponsePayload = response => {
    // payload is only provided in dev environment, the data is not available in prod at all
    if (response.payload) {
      const intent = response.payload[0].queryResult.intent;
      console.log ('query:', response.query);
      console.log ('  response:', response.response);
      console.log ('  intent:', intent ? intent.displayName : 'unknown');
      console.log ('  parameters:', response.payload[0].queryResult.parameters.fields);
      console.log (response.payload);
    }
    return response;
  };

  const addEditableMessage = () => {
    const newMessage = $ (editableMessage).on ('keydown', event => event.keyCode === 13 ? sendMessage (event.target.innerText) : '');
    $ ('#messages').append (newMessage);
    scrollToBottomOfMessages ();
    focus (document.querySelector ('div[contenteditable=true]'));
    $ ('.send').on ('click', event => sendMessage ($ (event.target).parent ().find ('.text').text ()));

  };

  const stripHTML = html => new DOMParser ().parseFromString (html, 'text/html').body.textContent || '';

  const getOneMoreCharacter = text => target => text.substr (0, target.text ().length + 1);

  const typeCharacter = text => target =>
    target.text (getOneMoreCharacter (text) (target)) &&
    scrollToBottomOfMessages () &&
    target;

  const type = strippedFullText => target => resolve =>
    target.text () !== strippedFullText ?
      setTimeout (
        () => type (strippedFullText) (typeCharacter (strippedFullText) (target)) (resolve),
        20) :
      resolve (target);

  const typing = fullText => target => new Promise (resolve => type (fullText) (target) (resolve));

  const finishAIResponse = message => JQueryElement =>
    JQueryElement.find ('.text').html (message) && addEditableMessage () && JQueryElement;

  const sendMessage = message => {
    if (!message) return;
    turnOffAllContenteditable ();
    const sendButton = $ ('.send');
    sendButton.text ('[ Sending... ]');
    const newMessage = $ (newResponse);
    $ ('#messages').append (newMessage);
    askAI (message)
    .done (response =>
      logDebugResponsePayload (response) &&
      sendButton.remove () &&
      typing (stripHTML (response.response)) (newMessage.find ('.typing'))
      .then (() => finishAIResponse (response.response) (newMessage))
    )
    .fail (() =>
      sendButton.remove () &&
      finishAIResponse ('I have trouble communicating with my server.') (newMessage));
  };

  window.sendMenuMessage = message => {
    $ ('div[contenteditable=true]').text (message);
    sendMessage (message);
  };

  addEditableMessage ();
}