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

import typescript from 'rollup-plugin-typescript';
import { uglify } from "rollup-plugin-uglify";
import copy from 'rollup-plugin-copy'

const IIFE_NAME = 'remoteStyles';

const baseConfig = ({ input, distSubFile, format, target, name, plugins = [] }) => ({
    input,
    output: {
      file: `./dist/${distSubFile}`,
      format,
      name,
    },
    plugins:[
      typescript({ target }),
      ...plugins
    ],
})

const mainConfig = ({ distSubFile, format, target, name, plugins = [] }) => baseConfig({
  input: './src/index.ts',
  distSubFile,
  name,
  target,
  format,
  plugins
});

const loaderConfig = ({ distSubFile, format, target, name, plugins = [] }) => baseConfig({
  input: './src/loader/index.ts',
  distSubFile,
  name,
  target,
  format,
  plugins
});

/**
 * This config builds the core lib for webpack users
 * ex: import { initialize } from 'remote-styles';
 */
const MAIN_MODULE_CONFIG = mainConfig({
  distSubFile: 'packages-dist/remote-styles/index.js',
  format: 'esm',
  target: 'esnext',
});


/**
 * This config builds the core lib for script tag users
 * ex: <script src="/remote-styles.js"></script>;
 */
const MAIN_IIFE_CONFIG = mainConfig({
  distSubFile: 'packages-dist/remote-styles/dist/remote-styles.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5'
});

const MAIN_IIFE_CONFIG_MIN = mainConfig({
  distSubFile: 'packages-dist/remote-styles/dist/remote-styles.min.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5',
  plugins: [ uglify() ]
});


/**
 * This config builds the loader lib for webpack users
 * ex: import { initialize } from 'remote-styles/loader';
 */
const LOADER_MODULE_CONFIG = loaderConfig({
  distSubFile: 'packages-dist/remote-styles/loader/index.js',
  format: 'esm',
  target: 'esnext',
});

/**
 * This config builds the loader lib for script tag users
 * ex: <script src="/remote-styles-loader.js"></script>;
 */
const LOADER_IIFE_CONFIG = loaderConfig({
  distSubFile: 'packages-dist/remote-styles/dist/remote-styles-loader.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5',
});

const LOADER_IIFE_CONFIG_MIN = loaderConfig({
  distSubFile: 'packages-dist/remote-styles/dist/remote-styles-loader.min.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5',
  plugins: [ uglify() ]
});

/**
 * CONFIG FOR E2E BUILDS
 */
const MAIN_IIFE_SITE_CONFIG = mainConfig({
  distSubFile: 'site/js/remote-styles.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5',
  plugins: [ 
    copy({
      targets: [
        { src: './src/site/index.html', dest: './dist/site'}
      ]
    })
  ]
})


export default [
  MAIN_MODULE_CONFIG,
  MAIN_IIFE_CONFIG,
  MAIN_IIFE_CONFIG_MIN,
  LOADER_MODULE_CONFIG,
  LOADER_IIFE_CONFIG,
  LOADER_IIFE_CONFIG_MIN,
  MAIN_IIFE_SITE_CONFIG,
];
