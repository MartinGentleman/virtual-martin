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

  const scrollToBottom = target => (target.scrollTop = target.scrollHeight) && target;
  const scrollToBottomOfMessages = () => scrollToBottom ($ ('#messages').get (0));

  const turnOffAllContenteditable = () => $ ('[contenteditable=true]').attr ('contenteditable', 'false');

  const askAI = message => $.post ('/api/v1/query', {message: message});

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

  let isAIResponding = false;

  const toggleAIResponding = () => {
    console.log (isAIResponding);
    isAIResponding = !isAIResponding;
    console.log (isAIResponding);
    if (isAIResponding === true) $ ('.dialogueAnchor').css ('color', '#666');
    else $ ('.dialogueAnchor').css ('color', '#000');
    return isAIResponding;
  };

  const finishAIResponse = message => JQueryElement => {
    JQueryElement.find ('.text').html (message);
    addEditableMessage ();
    toggleAIResponding ();
    return JQueryElement;
  };

  const sendMessage = message => {
    if (!message) return;
    toggleAIResponding ();
    turnOffAllContenteditable ();
    const sendButton = $ ('.send');
    sendButton.text ('[ Sending... ]');
    const newMessage = $ (newResponse);
    askAI (message)
      .always (() => $ ('#messages').append (newMessage))
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

  const initialize = () => {
    toggleAIResponding ();
    const target = $ ('#messages .message.ai:last');
    const textElement = target.find ('.text');
    const message = textElement.html ();
    textElement.html ('<span class="typing"></span>');
    typing (stripHTML (message)) (target.find ('.typing'))
      .then (() => finishAIResponse (message) (target));
  };

  initialize ();

  window.sendMenuMessage = message => {
    if (isAIResponding) return;
    $ ('div[contenteditable=true]').text (message);
    sendMessage (message);
  };
}