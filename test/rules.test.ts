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

import { createRules } from '../src/rules';
import { RemoteRule, RemoteStyle } from '../src/types';

describe('creating css rules', () => {

  const TEST_STYLES: RemoteStyle[] = [
    { 
      selectorText: '.text-bold',
      properties: [
        'font-weight: bold;',
        'color: #f00;'
      ]
    },
    {
      selectorText: '.text-light',
      properties: [
        'font-weight: 100;',
        'color: #f00;'
      ]
    }
  ];

  const TEST_RULES: RemoteRule[] = [
    { 
      cssText: '.text-bold{font-weight: bold;\ncolor: #f00;}',
      index: -1,
      enabled: true, 
    },
    {
      cssText: '.text-light{font-weight: 100;\ncolor: #f00;}',
      index: -1,
      enabled: true,
    }
  ];

  test('it should create a CSS rule from a remote style', () => {
    const rules = createRules([
      TEST_STYLES[0]
    ]);
    
    expect(rules.length).toEqual(1);
    expect(rules[0]).toEqual(TEST_RULES[0]);
  });

  test('it should create multiple CSS rules from multiple remote styles', () => {
    const rules = createRules(TEST_STYLES);
    expect(rules.length).toEqual(2);
    rules.forEach((rule, i) => {
      expect(rule).toEqual(TEST_RULES[i]);
    });
  });

});

