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

import { initialize } from 'remote-styles';
import * as firebase from 'firebase/app';
import 'firebase/remote-config';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCmZMdR7hR4d8AnT0-cj2LYYUUcFwssA3A",
  authDomain: "remote-styles.firebaseapp.com",
  databaseURL: "https://remote-styles.firebaseio.com",
  projectId: "remote-styles",
  storageBucket: "remote-styles.appspot.com",
  messagingSenderId: "1083520640050",
  appId: "1:1083520640050:web:5fa55b6869a0616644082b",
  measurementId: "G-3PEBDBCEQD"
});

initialize(firebaseApp).then(remoteStyles => {
  const styles = remoteStyles('CSS');
  styles.insert();
});
