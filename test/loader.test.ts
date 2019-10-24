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

import { checkWindowForLocalApp } from '../src/loader/checkWindowForLocalApp';
import { firebaseAppHasNeededFeatures } from '../src/loader/firebaseAppHasNeededFeatures';
import * as firebase from 'firebase/app';
import { config } from './firebase.config';

describe('Loader', () =>{

  let app: firebase.app.App;

  afterEach((done) => {
    if(app != undefined) {
      app.delete().then(done);
    } else {
      done();
    }
  });

  describe('checkWindowForLocalApp()', () => {
    
    it('should returned undefined if window.firebase does not exist', () => {
      const mockWindow = { };
      const localApp = checkWindowForLocalApp(mockWindow, {}, 'app');
      expect(localApp).toBeUndefined();
    });

    it('should return a local app that exists', () => {
      const mockWindow = { firebase };
      firebase.initializeApp(config, 'app');
      const app = checkWindowForLocalApp(mockWindow, config, 'app');
      expect(app).toBeDefined();
      expect(app.name).toEqual('app');
      expect(firebase.apps.length).toEqual(1);
    });

    it('should create a new app when no app exists', () => {
      const mockWindow = { firebase };
      const app = checkWindowForLocalApp(mockWindow, config, 'app');
      expect(app).toBeDefined();
      expect(app.name).toEqual('app');
      expect(firebase.apps.length).toEqual(1);
    });

  });

  describe('firebaseAppHasNeededFeatures()', () => {

    it('should return false when the firebase app is undefined', () => {
      const result = firebaseAppHasNeededFeatures(undefined);
      expect(result).toEqual(false);
    });

    it('should return false when remote config is not loaded', async (done) => {
      await import('firebase/analytics');
      app = firebase.initializeApp(config);
      const result = firebaseAppHasNeededFeatures(app);
      expect(result).toEqual(false);
      done();
    });

    it('should return true when remote config and analytics are loaded', async (done) => {
      await Promise.all([ 
        import('firebase/remote-config'), 
        import('firebase/analytics'),
      ]);
      app = firebase.initializeApp(config);
      const result = firebaseAppHasNeededFeatures(app);
      expect(result).toEqual(true);
      done();
    });
  });

});
