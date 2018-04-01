const isBrowser = {
  // Opera 8.0+
  opera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
  // Firefox 1.0+
  firefox: typeof InstallTrigger !== 'undefined',
  // Safari 3.0+ "[object HTMLElementConstructor]"
  safari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
  // Internet Explorer 6-11
  ie: /*@cc_on!@*/false || !!document.documentMode,
  // Edge 20+
  edge: !this.ie && !!window.StyleMedia,
  // Chrome 1+
  chrome: !!window.chrome && !!window.chrome.webstore,
  // Blink engine detection
  blink: (this.chrome || this.opera) && !!window.CSS
};
