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

import { argv } from 'yargs';
import { getAccessToken } from './accessToken';
import { getRC, putRC } from './fetchRC';
import * as fs from 'fs';
import * as path from 'path';

const config = getConfig();

interface CLIConfig {
  command: string; 
  file?: string;  
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
  return { command, file, saPath, out, key };
}

function getServiceAccount(saPath: string) {
  return require(path.join(process.cwd(), saPath));
}

async function getCommand({ saPath, key, out }: CLIConfig) {
  const serviceAccount = getServiceAccount(saPath);
  const token = await getAccessToken(serviceAccount);
  const project = serviceAccount.project_id;
  const resultGet = await getRC({ project, token });
  const css = resultGet.json.parameters[key].defaultValue.value;
  if(out) {
    const outPath = path.join(process.cwd(), out);
    // TODO(davideast): Stop being lazy and promisify
    fs.writeFile(outPath, css, 'utf8', err => {
      if(err) { console.log(err); return; }
      console.log(`Wrote ${outPath}`);
    });
  } else {
    console.log(css);
  }
}

async function putCommand({ file, saPath, key }: CLIConfig) {
  // TODO(davideast): Look into caching this token
  const serviceAccount = getServiceAccount(saPath);
  const token = await getAccessToken(serviceAccount);
  const project = serviceAccount.project_id;
  const resultGet = await getRC({ project, token });
  const wholeConfig = resultGet.json;
  const etag = resultGet.response.headers.get('etag');
  // TODO(davideast): Stop being lazy, make async
  const cssValue = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const body = creadyRequestBody({ cssValue, wholeConfig, key });
  const resultPut = await putRC({
    token, body, etag, project
  });

  if(resultPut.response.status === 200) {
    console.log('Successfully uploaded to Remote Config!');
  } else {
    if(resultPut.json.error) {
      console.log(resultPut.json.error);
    } else {
      console.log('Uh oh. Something went really wrong. File an issue on the GitHub repo (https://github.com/FirebaseExtended/remote-styles) and let us know what happened.');
    }
  }
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

interface CLICommand {
  run: () => Promise<void>;
  help: string;
}

interface CommandMap {
  [key: string]: CLICommand
}

const commands: CommandMap = {
  get: { 
    run: () => getCommand(config),
    help: `
get [options] 

Description: Get the CSS value from Remote Config 

Required Options: 
  --key                                           specify the Remote Config parameter 
Optional Options:
  --out                                           file to save output
  --sa                                            location of the service account file

Examples:
  remote-styles get --key="my-css" --out="styles.css" --sa="./service-account.json"
  remote-styles get --key="my-css" --out="styles.css" --sa="./service-account.json"
  remote-styles get --key="my-css" --sa="./service-account.json"
`
  },
  put: { 
    run: () => putCommand(config),
    help: `
put [options] [file]

Description: Upload CSS to Remote Config. *No other parameters are affected* remote-styles merges your changes with your active parameters.

Required Options: 
  --key                                           specify the Remote Config parameter 
Optional Options:
  --out                                           file to save output
  --sa                                            location of the service account file

Examples:
    remote-styles put --key="my-css" --sa="./service-account.json" styles.css
`
  },
};

function getHelp(commands: CommandMap) {
  const usage = `Usage: remote-styles [options] [command]`;
  const options = `Options:
  --help                                          output usage information
  --version                                       get the current version`;

  const commandHelp = Object.keys(commands).map(key => commands[key].help).join('\n');

  const printCommands = `Commands:
${commandHelp}
`;
  return `${usage}

${options}
${printCommands}
`;
}

try {
  const command = commands[config.command];
  if(command == undefined) {
    console.log(getHelp(commands));
  }
  command.run();
} catch(error) {
  getHelp(commands);
}
