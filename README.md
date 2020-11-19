<h2 align="center">Gorilla</h2>
<h3 align="center">Stop monkeying around and write better scripts</h3>

<p align="center">
  <em>
    GreaseMonkey · TamperMonkey
  </em>
</p>

## Intro

Gorilla is a blazing fast, TypeScript build tool for creating better
GreaseMonkey scripts. It handles the complex build chain, so you don't
have to.

### Input

`package.json`

<!-- prettier-ignore -->
```js
...
"scripts": {
    "build": "gorilla --input ./main.ts --output ./script.user.js"
  },
...
```

### Output

`script.user.js`

<!-- prettier-ignore -->
```js
// ==UserScript==
// @name    New Userscript
// @namespace    http://tampermonkey.net/
// @version    0.1
// @description    Gorilla-built, rock-solid, Monkey script
// @updateURL    
// @downloadURL    
// @author    You
// @match    http://*/*
// Created with love using Gorilla
// ==/UserScript==

console.log('hello!');
```
