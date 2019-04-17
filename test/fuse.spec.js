/* eslint-env mocha */

const assert = require('assert');
const svgson = require('svgson');
const rimraf = require('rimraf');
const path = require('path');
const { FuseBox } = require('fuse-box');
const { SVGStorePlugin } = require('..');

async function bundle(...plugins) {
  await new Promise(r => rimraf(path.join(__dirname, 'build'), r));
  const fuse = FuseBox.init({
    homeDir: __dirname,
    output: path.join(__dirname, 'build/$name'),
    plugins,
    globals: { default: '*' },
    log: { enabled: false },
  });
  fuse.bundle('bundle.js').instructions('> index.ts');
  await fuse.run();
}

describe('SVGStorePlugin', () => {
  describe('without options', () => {
    before(async () => {
      await bundle(SVGStorePlugin());
    });
    it('should export use path ', async () => {
      // eslint-disable-next-line global-require, import/no-unresolved
      const { path1, path2 } = require('./build/bundle');
      assert.strictEqual(path1, '#assets/test1.svg');
      assert.strictEqual(path2, '#assets/test2.svg');
    });
    it('should export svg containing symbol', async () => {
      // eslint-disable-next-line global-require, import/no-unresolved
      const { svg1, svg2 } = require('./build/bundle');
      const actual1 = await svgson.parse(svg1);
      const expected1 = await svgson.parse(`
          <svg>
              <defs/>
              <symbol id="assets/test1.svg" viewBox="0 0 100 100">
                  <circle r="32" cx="35" cy="65" fill="#F00" opacity="0.5"/>
                  <circle r="32" cx="65" cy="65" fill="#0F0" opacity="0.5"/>
                  <circle r="32" cx="50" cy="35" fill="#00F" opacity="0.5"/>
              </symbol>
          </svg>
      `);
      assert.deepStrictEqual(actual1, expected1);
      const actual2 = await svgson.parse(svg2);
      const expected2 = await svgson.parse(`
          <svg>
              <defs>
                  <g id="src" opacity="0.5" fill="none" stroke-width="12">
                      <circle cx="-20" cy="19" r="1"/>
                      <path d="M0,19s0-20-20-20m0-19s40,0,40,40" stroke-linecap="round"/>
                  </g>
              </defs>
              <symbol id="assets/test2.svg" viewBox="0 0 100 100">
                  <use xlink:href="#src" transform="translate(64,56) rotate(240)" stroke="#44F"/>
                  <use xlink:href="#src" transform="translate(42,36) rotate(120)" stroke="#0C0"/>
                  <use xlink:href="#src" transform="translate(35,65)" stroke="#F00"/>
              </symbol>
          </svg>
      `);
      assert.deepStrictEqual(actual2, expected2);
    });
  });
});
