// Copyright 2019 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { FirebaseRemoteConfig, RemoteRule, RemoteStyle } from './types';

function getValueAsObject(remoteConfig: FirebaseRemoteConfig, key: string) {
  return JSON.parse(remoteConfig.getValue(key).asString());
}

function checkSheet(sheet?: CSSStyleSheet): CSSStyleSheet {
  return sheet == undefined ? createSheet() : sheet;
}

async function fetchStyles(remoteConfig: FirebaseRemoteConfig, key: string) {
  await remoteConfig.fetchAndActivate();
  const remoteStyles = getValueAsObject(remoteConfig, key);
  return createRules(remoteStyles);
} 

function _insertRules(rules: RemoteRule[], sheet: CSSStyleSheet) {
  return rules
    .filter(r => r.enabled)
    .forEach(r => sheet.insertRule(r.cssText, r.index));
}

function createRules(remoteStyles: RemoteStyle[]): RemoteRule[] {
  return remoteStyles.map(config => {
    const enabled = config.enabled == undefined ? true : config.enabled;
    const cssText = config.selectorText + '{' + config.properties.join('\n') + '}';
    const index = config.index == undefined ? -1 : config.index;
    return { cssText, index, enabled };
  });
}

function createSheet(): CSSStyleSheet {
  const style = document.createElement('style');
  // WebKit hack
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  // TODO(davideast): Figure out why this returns the wrong type?
  return style.sheet as CSSStyleSheet;
}

async function fetchAndActivateStyles(remoteConfig: FirebaseRemoteConfig, key: string, sheet?: CSSStyleSheet) {
  const rules = await fetchStyles(remoteConfig, key);
  const _sheet = checkSheet(sheet);
  return {
    insertRules: () => _insertRules(rules, _sheet)
  }
}

function sum(a: number, b: number) {
  return a + b;
}

export { fetchAndActivateStyles, sum };