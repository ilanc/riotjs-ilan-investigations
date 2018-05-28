# Running code once for all tags

## How to run
* run `run.bat`
* browse http://127.0.0.1:8008/once-per-tag/

## Overview

GOAL:
* `<login-failed>` wants to fetch `login-failed.json` once and use the data in every `<login-failed>` tag that is instantiated.
* i.e. we need to handle 2 things:
  * once-per-tag
  * & update after async calls complete

NOTE: this is probably poor design - the fetch should probably be called in the parent tag (`<app>`) and passed in as scope to the tag (`<login-failed scope={fetch.loginfailed}>`)

Features to note:
* 2 tags are instantiated in `app.tag.html`:

```html
<login-failed></login-failed>
<login-failed></login-failed> <!-- NOTE: 2 instances -->
```

* Each tag causes code in `login-failed.tag.html` to be evaluated with a different `tag` instance
* Both invocations call:

```js
init_error(tag, 'login-failed');
```

* The first invocation of `init_error` initiates a fetch - see `global.js`:

```js
// NOTE: returns runOne(), which itself returns a Promise (fetch_error)
// Hence 2nd+ call to init_error(tag2+) will await the same Promise which is busy fetching DATA
let errorJson = await Once(fetch_error)(DATA);
```

* The second invocation of `init_error` gets a reference to the promise that was created in invocation #1
* When `fetch_error` returns the 2 `init_error` invocations continue and they have closures on `tag`
* Hence both tags have `tag.data` set and `tag.Update()`
* NOTE: `function Once` is implemented in `global.js`:
  * it uses the `file:line` of the caller to determine whether the call has been invoked
  * and saves the result (which is a promise in this case) in `_once[caller]`
