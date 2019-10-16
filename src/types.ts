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

// These import types keep us from including Firebase in the bundle, but 
// while still getting the types we need.

type FirebaseRemoteConfig = import('firebase/app').remoteConfig.RemoteConfig;
type FirebaseApp = import('firebase/app').app.App;
type FirebaseAnalytics = import('firebase/app').analytics.Analytics;
type FirebasePerformance = import('firebase/app').performance.Performance;
type NullableFirebaseApp = FirebaseApp | null | undefined;

enum FirebaseFeature {
  app = 'app',
  analytics = 'analytics',
  remoteConfig = 'remote-config',
}

interface RemoteStyle {
  selectorText: string;
  properties: string[];
  enabled?: boolean;
  index?: number;
}

interface RemoteRule {
  cssText: string;
  index: number;
  enabled: boolean;
}

interface RemoteStylesOptions { 
  firebaseApp: FirebaseApp, 
  sheet?: CSSStyleSheet 
}

export {
  FirebaseApp,
  FirebaseAnalytics,
  FirebaseRemoteConfig,
  FirebasePerformance,
  NullableFirebaseApp,

  FirebaseFeature,

  RemoteStyle,
  RemoteRule,
  RemoteStylesOptions,
};
