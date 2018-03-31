document.execCommand("defaultParagraphSeparator", false, "br");

const messageTemplate =
  `<div class="message"><div class="arrow">></div><div class="text" contenteditable="true"></div></div>`;

const sendMessage  = () => {
  $ ('div[contenteditable=true]').attr ('contenteditable', 'false');
  addEditableMessage ();
};

const addEditableMessage = () => {
  const newMessage = $ (messageTemplate).on ('keydown', event => event.keyCode === 13 ? sendMessage () : '');
  $ ('#messages').append (newMessage);
  setTimeout(function() {
    document.querySelector('div[contenteditable=true]').focus();
  }, 0);
};
addEditableMessage ();


// https://speckyboy.com/css-javascript-text-animation-snippets/ number 5

const type = () => {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};
