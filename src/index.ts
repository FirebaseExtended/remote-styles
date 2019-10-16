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

import { FirebaseRemoteConfig, RemoteRule, FirebaseApp } from './types';
import { createRules } from './rules';

/**
 * Return a value from Remote Config as a parsed JSON object
 * @param remoteConfig 
 * @param key 
 */
function getValueAsObject(remoteConfig: FirebaseRemoteConfig, key: string) {
  const stringValue = remoteConfig.getValue(key).asString();
  const EMPTY_STRING = ''.trim();
  if(stringValue === EMPTY_STRING) { return EMPTY_STRING; }
  return JSON.parse(stringValue);
}

/**
 * Create a new CSSStyleSheet if one is not passed as a parameter
 * @param sheet 
 */
function checkSheet(sheet?: CSSStyleSheet): CSSStyleSheet {
  return sheet == undefined ? createSheet() : sheet;
}

/**
 * 
 * @param remoteConfig 
 * @param key 
 */
function createRulesFromRemoteConfig(remoteConfig: FirebaseRemoteConfig, key: string) {
  return createRules(getValueAsObject(remoteConfig, key));
}

/**
 * Insert enabled rules into a stylesheet.
 * @param rules 
 * @param sheet 
 */
function _insertRules(rules: RemoteRule[], sheet: CSSStyleSheet) {
  return rules
    .filter(r => r.enabled)
    .forEach(r => sheet.insertRule(r.cssText, r.index));
}

/**
 * Create a CSSStylesheet and attach it to the document.
 */
function createSheet(document = window.document): CSSStyleSheet {
  const style = document.createElement('style');
  // WebKit hack
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  // TODO(davideast): Figure out why this returns the wrong type?
  return style.sheet as CSSStyleSheet;
}

function remoteStyles(key: string, sheet: CSSStyleSheet, firebaseApp: FirebaseApp) {
  const rules = createRulesFromRemoteConfig(firebaseApp.remoteConfig(), key);
  return {
    insert: () => _insertRules(rules, sheet),
    rules: () => rules,
    sheet: () => sheet,
    firebaseApp: () => firebaseApp,
  };
}

function checkFunction(fn?: Function) {
  return fn == undefined ? () => {} : fn;
}

async function initialize(firebaseApp: FirebaseApp, optionsCallback?: (app: FirebaseApp) => void) {
  checkFunction(optionsCallback)();
  await firebaseApp.remoteConfig().fetchAndActivate();
  return function _remoteStyles(key: string, sheet?: CSSStyleSheet) {
    return remoteStyles(key, checkSheet(sheet), firebaseApp);
  }
}

export { 
  initialize, 
};
