document.execCommand("defaultParagraphSeparator", false, "br");

const editableMessage =
  `<div class="message">
     <div class="arrow">></div>
     <div class="text" contenteditable="true"></div>
     <div class="send">[ Send ]</div>
   </div>`;

const newResponse = `<div class="message ai"><div class="text"><span class="typing"></span></div></div>`;

const focus = target => setTimeout(() => target.focus (), 0);

const scrollToBottom = target => target.scrollTop = target.scrollHeight;

const sendMessage = message => {
  if (!message) return;
  $ ('div[contenteditable=true]').attr ('contenteditable', 'false');
  $ ('.send').text ('[ Sending... ]');
  $.post ('/api/query', {message: message})
    .done (response => {
      const newMessage = $ (newResponse);
      $ ('#messages').append (newMessage);
      typing (newMessage, response.response);
      $ ('.send').remove ();
      if (response.payload) {
        console.log ('query:', response.query);
        console.log ('  response:', response.response);
        const intent = response.payload[0].queryResult.intent;
        console.log ('  intent:', intent ? intent.displayName : 'unknown');
      }
    })
    .fail (error => {
      console.log ('error', error);
      addEditableMessage ();
    });
};

const sendMenuMessage = message => {
  $ ('div[contenteditable=true]').text (message);
  return sendMessage (message);
};

const addEditableMessage = () => {
  const newMessage = $ (editableMessage).on ('keydown', event => event.keyCode === 13 ? sendMessage (event.target.innerText) : '');
  $ ('#messages').append (newMessage);
  scrollToBottom ($ ('#messages').get(0));
  focus (document.querySelector('div[contenteditable=true]'));
  $ ('.send').on ('click', event => sendMessage ($ (event.target).parent ().find ('.text').text ()));

};
addEditableMessage ();

const stripHTML = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const typing = (jQueryElement, fullText) => {
  if (!jQueryElement.length || !fullText) return;
  const target = jQueryElement.find ('.typing');
  const strippedFullText = stripHTML (fullText);
  const currentText = target.text ();
  if (currentText !== strippedFullText) {
    target.text (strippedFullText.substr (0, currentText.length+1));
    scrollToBottom ($ ('#messages').get(0));
    setTimeout(() => typing (jQueryElement, fullText), 20);
  } else {
    jQueryElement.find ('.text').html (fullText);
    addEditableMessage ();
  }
};