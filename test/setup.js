import jsdom from 'jsdom';

function setupDom() {
  if (typeof document === 'undefined') {
    global.document = jsdom.jsdom('');
    global.window = document.defaultView;
    global.navigator = window.navigator;
  }
}

setupDom();
