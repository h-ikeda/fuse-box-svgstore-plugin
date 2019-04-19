# SVGStore Plugin for FuseBox
This plugin allows you to handling SVG files with [svgstore](https://github.com/svgstore/svgstore) when using [FuseBox](https://fuse-box.org) bundler. It exports SVG texts those are wraped with `<symbol>` elements and path to them. Useful for structuring SVG sprites.

## Install
```
npm i --save-dev fuse-box-svgstore-plugin
```
or
```
yarn add --dev fuse-box-svgstore-plugin
```

## Usage
1. Configure your `fuse.js` file like below.
   ```js
   const { FuseBox } = require('fuse-box');
   const { SVGStorePlugin } = require('fuse-box-svgstore-plugin');
   
   const fuse = FuseBox.init({
       //...
   
       plugins: [SVGStorePlugin()],
    
       //...
   });
   
   // ...
   ```
2. Import `svg` and `path` from your SVG files.
   ```js
   import { svg, path } from './path/to/svgfile.svg';
   
   console.log(svg);
   // <svg><symbol id="...id_for_sprite...">...</symbol></svg>
   console.log(path);
   // #...id_for_sprite...
   ```
3. Inject SVG element to the DOM tree. For example,
   ```js
   const e = document.createElement('div');
   e.innerHTML = svg;
   e.firstElementChild.style.display = 'none';
   document.body.appendChild(e.firstElementChild);
   ```
4. Use SVG symbols in everywhere you need with `<use>` tag.
   ```html
   <html>
     <body>
       <div>
         <svg class="icon"></svg>
       </div>
     </body>
   </html>
   ```
   ```js
   const target = document.body.querySelector('svg.icon');
   target.innerHTML = `<use xlink:href="${path}"/>`;
   ```
