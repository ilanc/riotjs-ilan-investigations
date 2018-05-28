# Gotchas with multiple instances

## How to run
* run `run.bat`
* browse http://127.0.0.1:8008/multiple-tag-instances/

## Overview

For a `<file-open>` tag it's tricky to ensure that `onchange` events link to the correct tag.

NOTE: `<file-open>` contains 2 inter-related DOM elements:
1. `<label for="someId">` - used to design the button that the user clicks on
2. `<input id="someId" type="file">` - brings up the native file-open dialogue and gives access to the file ArrayBuffer

There are 2 problems:
1. Unique ids with multiple tag instances
2. riotjs gets wrong tag closure?

### Unique ids with multiple tag instances
1. you have to use ids to link `<label>` and `<input>`
2. however there will be 2 `#someId`s if you have two `<file-open>` tags, and this confuses the linking process
3. The solution is to ensure that the id is unique:
```
<label for="fileopen{_riot_id}">
  <input id="fileopen{_riot_id}">
</label>
```

### riotjs gets wrong tag closure?

Actually it gets it right - it was problem (1) which was masking the issue:
```
click _riot_id=4 boxid=3                file-open.tag.html.js:17
riotJs fileOpened _riot_id=4 boxid=3    file-open.tag.html.js:12
jQuery FileOpened _riot_id=4 boxid=3    file-open.tag.html.js:5
click _riot_id=5 boxid=4                file-open.tag.html.js:17
riotJs fileOpened _riot_id=5 boxid=4    file-open.tag.html.js:12
jQuery FileOpened _riot_id=5 boxid=4    file-open.tag.html.js:5
```

## Notes on mounting multiple instances, DOM creation, script eval, `this`

If you include `<child>` tags within a `<parent>` tag the children are automatically mounted when the parent is mounted:
* e.g. `<app>` (parent) contains 2 x `<box>` (child) and 2 x `<file-open>` (child)
* children are mounted during `riot.mount('app')` in `index.html`

This is the sequence of noteworthy events during `riot.mount('app')`
1. eval parent script
2. eval child scripts
  * repeated for each child instance (not say once per child type)
  * e.g. exec any global code - e.g. `console.log('box', opts.boxid)`, `var tag = this`
  * there's a new `this` in each child script eval - so you can capture `this` in closures e.g. jQuery event handlers like `FileOpened`, which won't have `this === tag`
3. mount the parent
  * DOM is now rendered and accessible
  * e.g. safe to access any refs `tag.input = tag.refs['input']`
4. mount the children

See console.log for `http://127.0.0.1:8008/multiple-tag-instances/`
```
app                                       app.tag.html.js:2
box 1                                     box.tag.html.js:2
box 2                                     box.tag.html.js:2
file-open _riot_id=4 boxid=3              file-open.tag.html.js:2
file-open _riot_id=5 boxid=4              file-open.tag.html.js:2
app mount 1                               app.tag.html.js:4
box mount 2 1                             box.tag.html.js:6
box mount 3 2                             box.tag.html.js:6
file-open mount 4 3                       file-open.tag.html.js:17
file-open mount 5 4                       file-open.tag.html.js:17
```
