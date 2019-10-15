import { RemoteStyle, RemoteRule } from './types';

function createRules(remoteStyles: RemoteStyle[]): RemoteRule[] {
  return remoteStyles.map(config => {
    const enabled = config.enabled == undefined ? true : config.enabled;
    const cssText = config.selectorText + '{' + config.properties.join('\n') + '}';
    const index = config.index == undefined ? -1 : config.index;
    return { cssText, index, enabled };
  });
}

export { 
  createRules, 
};