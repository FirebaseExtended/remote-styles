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

import { RemoteStyle, RemoteRule } from './types';

/**
 * Transform an array of styles from Remote Config to an 
 * array of CSS Rules that a CSSStyleSheet can insert.
 * @param remoteStyles 
 */
function createRules(remoteStyles: RemoteStyle[]): RemoteRule[] {
  return remoteStyles.map(style => {
    const cssText = createCSSText(style);
    const enabled = checkEnabled(style);
    const index = checkIndex(style);
    return { cssText, index, enabled };
  });
}

/**
 * Create a cssText string from a RemoteStyle
 * ex: .text-bold{font-weight:500;}
 * @param style 
 */
function createCSSText(style: RemoteStyle) {
  return style.selectorText + '{' + style.properties.join('\n') + '}';
}

function checkEnabled(style: RemoteStyle) {
  return style.enabled == undefined ? true : style.enabled
}

function checkIndex(style: RemoteStyle) {
  return style.index == undefined ? -1 : style.index;
}

export { 
  createRules, 
};