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

const IIFE_NAME = 'remoteStyles';

/**
 * This config builds the core lib for webpack users
 * ex: import { initialize } from 'remote-styles';
 */
const MAIN_MODULE_CONFIG = {
  input: './src/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/index.js',
    format: 'esm',
  },
  plugins: [
    typescript(),
  ],
};

/**
 * This config builds the core lib for script tag users
 * ex: <script src="/remote-styles.js"></script>;
 */
const MAIN_IIFE_CONFIG = {
  input: './src/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/remote-styles.js',
    format: 'iife',
    name: IIFE_NAME,
  },
  plugins: [
    typescript(),
  ],
};

/**
 * This config builds the loader lib for webpack users
 * ex: import { initialize } from 'remote-styles/loader';
 */
const LOADER_MODULE_CONFIG = {
  input: './src/loader/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/loader/index.js',
    format: 'esm',
  },
  plugins: [
    typescript(),
  ],
};

/**
 * This config builds the loader lib for script tag users
 * ex: <script src="/remote-styles-loader.js"></script>;
 */
const LOADER_IIFE_CONFIG = {
  input: './src/loader/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/loader/remote-styles-loader.js',
    format: 'iife',
    name: IIFE_NAME,
  },
  plugins: [
    typescript(),
  ],
};

export default [
  MAIN_MODULE_CONFIG,
  MAIN_IIFE_CONFIG,
  LOADER_MODULE_CONFIG,
  LOADER_IIFE_CONFIG,
];
