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