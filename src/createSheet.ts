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

/**
 * Create a CSSStylesheet and attach it to the document.
 */
export function createSheet(): CSSStyleSheet {
  let sheet;
  try {
    sheet = new CSSStyleSheet();
  }
  catch (e) {
    const style = document.createElement('style');
    // WebKit hack
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    sheet = style.sheet;
  }
  // TODO(davideast): Figure out why this returns the wrong type?
  return sheet as CSSStyleSheet;
}
