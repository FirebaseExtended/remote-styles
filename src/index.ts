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
  return remoteConfig.getString(key);
  // return createRules(getValueAsObject(remoteConfig, key));
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
  let sheet;
  try {
    sheet = new CSSStyleSheet();
  } catch(e) {
    const style = document.createElement('style');
    // WebKit hack
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    sheet = style.sheet;
  }
  // TODO(davideast): Figure out why this returns the wrong type?
  return sheet as CSSStyleSheet;
}

function applyCss(sheet: CSSStyleSheet, css: string, document = window.document): CSSStyleSheet {
  try {
    // Constructable Stylesheets available in Chrome 66+ only
    // TODO(davideast): Properly fix this TypeScript hack
    // TypeScript does not recognize adoptedStyleSheets since it is new
    const _sheet = sheet as any;
    const doc: any = document; 
    _sheet.replaceSync(css);
    doc.adoptedStyleSheets = doc.adoptedStyleSheets.concat(sheet);
  } catch (e) {
    sheet.ownerNode.appendChild(document.createTextNode(css));
  }
  return sheet;
}

function remoteStyles(key: string, sheet: CSSStyleSheet, firebaseApp: FirebaseApp) {
  const stylesString = firebaseApp.remoteConfig().getString(key);
  return {
    insert: () => applyCss(sheet, stylesString),
    styles: () => stylesString,
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
