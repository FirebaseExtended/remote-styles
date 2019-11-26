/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const shell = require('shelljs');
const { LIB_VERSION } = require('./versions.json');
const { name } = require('./package.json');
const fs = require('fs');

// TODO(davideast): Look into using a rollup plugin to fix this hack
// Right now we have to add "#! /usr/bin/env node" manually to the top of the
// file so it doesn't error out when used in the CLI
const cliLines = fs.readFileSync('./dist/packages-dist/remote-styles/cli/index.js')
  .toString().split('\n');
cliLines.splice(0, 0, '#! /usr/bin/env node');
const cliScript = cliLines.join('\n');
fs.writeFileSync('./dist/packages-dist/remote-styles/cli/index.js', cliScript, 'utf8');

if (shell.exec('node_modules/.bin/tsc').code !== 0) {
  shell.echo('Typings failed?');
  shell.exit(1);
}

if (shell.exec('npm pack ./dist/packages-dist/remote-styles').code !== 0) {
  shell.echo('Pack failed?');
  shell.exit(1);
}

if(shell.exec(`mv ./${name}-${LIB_VERSION}.tgz ./dist/site/remote-styles.tgz`).code !== 0) {
  shell.echo('Move tarball failed?');
  shell.exit(1);
}

if(shell.exec(`cp ./package.site.json ./dist/site/package.json`).code !== 0) {
  shell.echo('copy package.site.json failed?');
  shell.exit(1);
}

shell.cd(`dist/site`);

if(shell.exec(`npm i`).code !== 0) {
  shell.echo('npm i failed?');
  shell.exit(1);
}

if(shell.exec(`npm run webpack`).code !== 0) {
  shell.echo('npm run webpack` failed?');
  shell.exit(1);
}
