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

import { FirebaseApp, RemoteStyle } from './types';

/**
 * Create a new CSSStyleSheet if one is not passed as a parameter
 * @param sheet 
 */
function checkSheet(sheet?: CSSStyleSheet): CSSStyleSheet {
  // TODO(davideast): Reject if ownerNode is link[rel="stylesheet"].
  const realSheet = sheet == undefined ? createSheet() : sheet;
  if(realSheet.ownerNode.nodeName === 'LINK') {
    throw new Error('<link rel="stylesheet"> are not supported. Use the sheet from a <style></style> tag or a new CSSStyleSheet().');
  }
  return realSheet;
}

/**
 * Create a CSSStylesheet and attach it to the document.
 */
function createSheet(): CSSStyleSheet {
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

function insertCSS(sheet: CSSStyleSheet, css: string) {
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
}

function remoteStyles(key: string, sheet: CSSStyleSheet, firebaseApp: FirebaseApp): RemoteStyle {
  const stylesString = firebaseApp.remoteConfig().getString(key);
  return {
    insert: () => insertCSS(sheet, stylesString),
    asString: () => stylesString,
    sheet: () => sheet,
    firebaseApp: () => firebaseApp,
  };
}

function checkFunction(fn?: Function) {
  return fn == undefined ? () => {} : fn;
}

function initialize(firebaseApp: FirebaseApp, optionsCallback?: (app: FirebaseApp) => void) {
  checkFunction(optionsCallback)();
  return firebaseApp.remoteConfig().fetchAndActivate().then(() => {
    return function _remoteStyles(key: string, sheet?: CSSStyleSheet) {
      return remoteStyles(key, checkSheet(sheet), firebaseApp);
    }
  });
}

export { 
  initialize, 
};
