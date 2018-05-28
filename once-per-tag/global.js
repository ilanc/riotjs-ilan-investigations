async function fetch_error(error) {
  let url = error + '.json';
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
  let errorJson = await fetch_error(DATA);
  if (errorJson.data) {
    tag.data = errorJson.data.uxdata;
    tag.update();
  } else {
    alert('Failed to load data: ' + DATA);
  }
}

// Modied from: https://medium.freecodecamp.org/here-are-a-few-function-decorators-you-can-write-from-scratch-488549fe8f86
const _once = {};
function Once(cb) {
  let e = new Error();
  let stack = e.stack.split('\n');
  let fn = stack[2];
  return function runOnce() {
    if (!_once.hasOwnProperty(fn)) {
      console.log('once =>', fn, cb);
      _once[fn] = cb.apply(this, arguments);
    }
    return _once[fn];
  }
}
// usage:
// let processonce = once(process);
// processonce(); // process
