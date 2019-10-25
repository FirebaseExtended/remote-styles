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

import { argv, Argv } from 'yargs';
import { getAccessToken } from './accessToken';
import { getRC, putRC } from './fetchRC';
import * as fs from 'fs';
import * as path from 'path';

console.log(argv);

const config = getConfig();

interface CLIConfig {
  command: string; 
  file?: string; 
  project?: string; 
  saPath?: string;
  out?: string;
  key?: string;
}

function getConfig(): CLIConfig {
  const command = argv._[0];
  const file = argv._[1];
  const out = argv.out as string;
  const key = argv.key as string;
  // TODO(davideast): Check project in .rsrc.json
  const project = argv.project as string;
  const saPath = argv.sa as string;
  return { command, file, project, saPath, out, key };
}

async function getCommand({ project, saPath, key, out }: CLIConfig) {
  const token = await getAccessToken(saPath);
  const resultGet = await getRC({ project, token });
  const css = resultGet.json.parameters[key].defaultValue.value;
  const outPath = path.join(process.cwd(), out);
  fs.writeFile(outPath, css, 'utf8', err => {
    if(err) { console.log(err); return; }
    console.log(`Wrote ${outPath}`);
  });
}

async function putCommand({ file, project, saPath, key }: CLIConfig) {
  // TODO(davideast): Look into caching this token
  const token = await getAccessToken(saPath);
  const resultGet = await getRC({ project, token });
  const wholeConfig = resultGet.json;
  const etag = resultGet.response.headers.get('etag');
  // TODO(davideast): Stop being lazy, make async
  const cssValue = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const body = creadyRequestBody({ cssValue, wholeConfig, key });
  const resultPut = await putRC({
    token, body, etag, project
  });
  console.log(resultPut);
}

function creadyRequestBody({ cssValue, wholeConfig, key }, merge = true) {
  if(merge) {
    // write over the key only, merge with the rest of the config
    wholeConfig.parameters[key] = { defaultValue: { value: null } };
    wholeConfig.parameters[key].defaultValue.value = cssValue;
    return JSON.stringify(wholeConfig);
  }
  return JSON.stringify({ parameters: { [key]: { value: cssValue } } });
}

const commands = {
  // remote-styles get --key="CSS" --out="styles.css"
  get: () => { getCommand(config) },
  // remote-styles put styles.css
  put: () => { putCommand(config) },
};

commands[config.command]();
