async function fetch_error(error) {
  let url = error + '.json';
  console.log('fetch', url);
  try {
    const response = await fetch(url, { method: 'GET' });
    const json = await response.json();
    if (response.status !== 200) {
      return { error: `network error - response status code ${response.status}` };
    } else {
      return { data: json };
    }
  } catch (ex) {
    return { error: `socket connection failed` };
    console.error(ex);
  }
}

async function init_error(tag, DATA) {
  // NOTE: returns runOnce(), which itself returns a Promise (fetch_error)
  // Hence 2nd+ call to init_error(tag2+) will await the same Promise which is busy fetching DATA
  let errorJson = await Once(fetch_error)(DATA);
  if (errorJson.data) {
    tag.data = errorJson.data.uxdata;
    tag.update();
  } else {
    alert('Failed to load data');
  }
}

// Modified from: https://medium.freecodecamp.org/here-are-a-few-function-decorators-you-can-write-from-scratch-488549fe8f86
const _once = {};
function Once(fn) {
  let e = new Error();
  let stack = e.stack.split('\n');
  let caller = stack[2];
  return function runOnce() {
    if (!_once.hasOwnProperty(caller)) {
      console.log('once =>', caller);
      _once[caller] = fn.apply(this, arguments);
    }
    return _once[caller];
  }
}
// usage:
// let processonce = once(process);
// processonce(); // process
