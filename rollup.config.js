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

import typescript from 'rollup-plugin-typescript';

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

const MAIN_IIFE_CONFIG = {
  input: './src/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/index.iife.js',
    format: 'iife',
    name: 'remote_styles',
  },
  plugins: [
    typescript(),
  ],
};

const WINDOW_MODULE_CONFIG = {
  input: './src/window/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/window/index.js',
    format: 'esm',
  },
  plugins: [
    typescript(),
  ],
};

const WINDOW_IIFE_CONFIG = {
  input: './src/window/index.ts',
  output: {
    file: './dist/packages-dist/remote-styles/window/index.iife.js',
    format: 'iife',
    name: 'remote_styles_window',
  },
  plugins: [
    typescript(),
  ],
};

export default [
  MAIN_MODULE_CONFIG,
  MAIN_IIFE_CONFIG,
  WINDOW_MODULE_CONFIG,
  WINDOW_IIFE_CONFIG,
];
