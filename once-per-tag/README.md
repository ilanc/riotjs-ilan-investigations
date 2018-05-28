# Running code once for all tags

## How to run
* run `run.bat`
* browse http://127.0.0.1:8008/once-per-tag/

## Overview

GOAL: `<login-failed>` wants to fetch `login-failed.json` once and use the data in every `<login-failed>` tag that is instantiated.

NOTE: this is probably poor design - the fetch should probably be called in the parent tag (`<app>`) and passed in as scope to the tag (`<login-failed scope={fetch.loginfailed}>`)

Features to note:
* 2 tags are instantiated in `app.tag.html`:

```html
<login-failed></login-failed>
<login-failed></login-failed> <!-- NOTE: 2 instances -->
```

* Code to fetch `load-failed.json` is initiated in `login-failed.tag.html`:

```js
let initOnce = Once(init_error);
initOnce(tag, 'login/login-failed');
```

* `function Once` is implemented in `global.js`:
  * it uses the file:line of the caller to determine whether the call has been invoked
* Only the first tag is populated
  * TODO: change once(init_error) to once(fetch_error)