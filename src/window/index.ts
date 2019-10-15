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

import { FirebaseFeature, NullableFirebaseApp } from '../types';
import { fetchAndActivateStyles } from '../';

const FIREBASE_VERSION = '7.2.0';

function loadScript(src: string, document = window.document): Promise<Event> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadFirebaseScript(version: string, feature: FirebaseFeature) {
  return loadScript(`https://www.gstatic.com/firebasejs/${version}/firebase-${feature}.js`)
}

function loadFirebaseApp() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.app)
    .then(() => window.firebase);
}

function loadAnalytics() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.analytics);
}

function loadRemoteConfig() {
  return loadFirebaseScript(FIREBASE_VERSION, FirebaseFeature.remoteConfig);
}

async function loadFirebaseFeatures() {
  // Firebase App must be loaded first
  const firebase = await loadFirebaseApp();
  return Promise.all([
    Promise.resolve(firebase),
    loadAnalytics(),
    loadRemoteConfig(),
  ]).then(([firebase]) => firebase);
}

function checkWindowForLocalApp(window: any, options: any, name: string): NullableFirebaseApp {
  if(window.firebase != undefined) {
    if(window.firebase.apps.length > 0) {
      return window.firebase.apps.filter(a => a.name === name)[0];
    }
    return window.firebase.initializeApp(options);
  } else {
    return undefined;
  }
}

function firebaseAppHasNeededFeatures(firebaseApp: NullableFirebaseApp) {
  return firebaseApp != undefined && 
         firebaseApp.analytics != undefined && 
         firebaseApp.remoteConfig != undefined;  
}

async function initializeLazyApp(options: any, name = '[DEFAULT]') {
  const windowApp = checkWindowForLocalApp(window, options, name);
  if(firebaseAppHasNeededFeatures(windowApp)) {
    return Promise.resolve(windowApp);
  } else {
    const firebase = await loadFirebaseFeatures();
    return firebase.initializeApp(options, name);
  }
}

async function initializeStyles(options: any, name = '[DEFAULT]') {
  const firebaseApp = await initializeLazyApp(options, name);
  const remoteConfig = firebaseApp.remoteConfig();
  return function(key: string, sheet?: CSSStyleSheet) {
    return fetchAndActivateStyles(remoteConfig, key, sheet);
  }
}

export { initializeLazyApp, initializeStyles };
