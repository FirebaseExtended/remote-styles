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

import { FirebaseFeature, NullableFirebaseApp, FirebaseApp } from '../types';
import { initialize as initializeRemoteStyles } from '../';

// Fixed Firebase version to use from CDN
const FIREBASE_VERSION = '7.2.0';

/**
 * Create a script from a src. Promise resolves when script loads.
 * @param src 
 * @param document 
 */
function loadScript(src: string, document = window.document): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Load a Firebase script from the CDN
 * @param version 
 * @param feature 
 */
function loadFirebaseScript(version: string, feature: FirebaseFeature) {
  return loadScript(`https://www.gstatic.com/firebasejs/${version}/firebase-${feature}.js`)
}

/**
 * Load the Firebase App script
 */
function loadFirebaseApp() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.app)
    .then(() => window.firebase);
}

/**
 * Load the Analytics script
 */
function loadAnalytics() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.analytics);
}

/**
 * Load the Remote Config script
 */
function loadRemoteConfig() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.remoteConfig);
}

/**
 * Load the needed Firebase features for the remote-styles library.
 */
async function loadFirebaseFeatures() {
  // Firebase App must be loaded first
  const firebase = await loadFirebaseApp();
  return Promise.all([
    Promise.resolve(firebase),
    loadAnalytics(),
    loadRemoteConfig(),
  ]).then(([firebase]) => firebase);
}

/**
 * Check the window for an existing Firebase App
 * @param window 
 * @param options 
 * @param name 
 */
function checkWindowForLocalApp(window: any, options: any, name: string): NullableFirebaseApp {
  if(window.firebase != undefined) {
    if(window.firebase.apps.length > 0) {
      return window.firebase.apps.filter(app => app.name === name)[0];
    }
    return window.firebase.initializeApp(options);
  } else {
    return undefined;
  }
}

/**
 * Check a Firebase App to see if it exists and has the needed features for remote-styles.
 * @param firebaseApp 
 */
function firebaseAppHasNeededFeatures(firebaseApp: NullableFirebaseApp) {
  return firebaseApp != undefined && 
         firebaseApp.analytics != undefined && 
         firebaseApp.remoteConfig != undefined;  
}

/**
 * Initialize a Firebase App with a lazy loaded strategy.
 * @param options 
 * @param name 
 */
async function initializeLazyApp(options: any, name = '[DEFAULT]') {
  const windowApp = checkWindowForLocalApp(window, options, name);
  if(firebaseAppHasNeededFeatures(windowApp)) {
    return Promise.resolve(windowApp);
  } else {
    const firebase = await loadFirebaseFeatures();
    return firebase.initializeApp(options, name);
  }
}

/**
 * Create an instance of remoteStyles with a lazy loaded strategy
 * @param options 
 * @param name 
 */
async function initialize(options: any, optionsCallback?: (app: FirebaseApp) => void, name = '[DEFAULT]') {
  const firebaseApp = await initializeLazyApp(options, name);
  return initializeRemoteStyles(firebaseApp, optionsCallback);
}

export { initializeLazyApp, initialize };
