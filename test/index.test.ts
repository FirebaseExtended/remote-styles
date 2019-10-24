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

import { checkSheet } from '../src/checkSheet';
import { checkFunction } from '../src/checkFunction';

describe('Main', () => {
  describe('checkSheet()', () => {

    it('should throw an error if a <link rel="stylesheet"> is the parent node', () => {
      const mockSheet = {
        ownerNode: { nodeName: 'LINK' }
      } as any;
      const wrap = () => checkSheet(mockSheet);
      expect(wrap).toThrow();
    });

    it('should accept a <style> element as the parent node', () => {
      const mockSheet = {
        ownerNode: { nodeName: 'STYLE' }
      } as any;
      const wrap = () => checkSheet(mockSheet);
      expect(wrap).not.toThrow();
    });

  });

  describe('checkFunction()', () => {
    it('should noop when undefined is passed', () => {
      const wrap = () => checkFunction(undefined)()
      expect(wrap).not.toThrow();
    });
    it('should call the function when passed', () => {
      // Create a function that would be checked
      const functionToCheck = () => { };
      const mock = { functionToCheck };
      // Spy on it so we can tell if it gets called later
      const spy = jest.spyOn(mock, 'functionToCheck');
      // Pass the spy and call the result
      checkFunction(mock.functionToCheck)();
      // The spy will know if it gets called
      expect(spy).toHaveBeenCalled();
      // It should also not throw any errors
      const wrap = () => checkFunction(() => { })()
      expect(wrap).not.toThrow();
    });
  });
});
