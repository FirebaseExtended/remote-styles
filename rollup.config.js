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
import generatePackageJson from 'rollup-plugin-generate-package-json'
import { LIB_VERSION, FIREBASE_VERSION } from './versions.json';

const IIFE_NAME = 'remoteStyles';

const baseConfig = ({ input, distSubFile, format, target, name, plugins = [] }) => ({
  input,
  output: {
    file: `./dist/${distSubFile}`,
    format,
    name,
  },
  plugins: [
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
  plugins: [
    copy({
      targets: [
        { src: './README.md', dest: './dist/packages-dist/remote-styles' }
      ]
    }),
    generatePackageJson({
      baseContents: {
        "name": "remote-styles",
        "version": LIB_VERSION,
        "description": "Load CSS from Firebase Remote Config",
        "main": "index.js",
        "browser": "./dist/remote-styles.min.js",
        "keywords": ['firebase'],
        "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
        "license": "Apache 2.0",
        "peerDependencies": {
          "firebase": FIREBASE_VERSION
        }
      }
    })
  ]
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
  plugins: [uglify()]
});

/**
 * This config builds the loader lib for webpack users
 * ex: import { initialize } from 'remote-styles/loader';
 */
const LOADER_MODULE_CONFIG = loaderConfig({
  distSubFile: 'packages-dist/remote-styles/loader/index.js',
  format: 'esm',
  target: 'esnext',
  plugins: [
    generatePackageJson({
      baseContents: {
        "name": "remote-styles/loader",
        "version": LIB_VERSION,
        "description": "Load CSS from Firebase Remote Config",
        "main": "index.js",
        "browser": "../dist/remote-styles-loader.min.js",
        "keywords": ['firebase'],
        "author": "Firebase <firebase-support@google.com> (https://firebase.google.com/)",
        "license": "Apache 2.0",
        "peerDependencies": {
          "firebase": FIREBASE_VERSION
        }
      }
    })
  ]
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
  plugins: [uglify()]
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
        { src: './src/site/index.html', dest: './dist/site' },
        { src: './node_modules/firebase/firebase-app.js', dest: './dist/site/js' },
        { src: './node_modules/firebase/firebase-remote-config.js', dest: './dist/site/js' },
      ]
    })
  ]
});


const LOADER_IFFE_SITE_CONFIG = loaderConfig({
  distSubFile: 'site/js/remote-styles-loader.js',
  format: 'iife',
  name: IIFE_NAME,
  target: 'es5',
  plugins: [
    copy({
      targets: [
        { src: './src/site/loader.html', dest: './dist/site' },
        { src: './webpack.config.js', dest: './dist/site' },
        { src: './index.js', dest: './dist/site' },
      ]
    })
  ]
});

export default [
  MAIN_MODULE_CONFIG,
  MAIN_IIFE_CONFIG,
  MAIN_IIFE_CONFIG_MIN,
  LOADER_MODULE_CONFIG,
  LOADER_IIFE_CONFIG,
  LOADER_IIFE_CONFIG_MIN,

  /* e2e configs */
  MAIN_IIFE_SITE_CONFIG,
  LOADER_IFFE_SITE_CONFIG,
];
