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

import fetch from 'node-fetch';

async function _fetchRC({ method, token, baseUrl, body, headers }: any) {
  const url = `${baseUrl}`;
  const options = {
    method,
    body,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; UTF8',
      ...headers,
    },
  }
  const response = await fetch(url, options);
  const json = await response.json();
  return { response, json };
}

function fetchRC({ method, token, project, body, headers }: any) {
  const baseUrl = `https://firebaseremoteconfig.googleapis.com/v1/projects/${project}/remoteConfig`;
  return _fetchRC({ method, token, baseUrl, body, headers });
}

function getRC({ token, project }: any) {
  return fetchRC({ method: 'GET', token, project });
}

async function putRC({ token, body, etag, project }: any) {
  return fetchRC({ 
    method: 'PUT', 
    token, 
    project,
    body,
    headers: {
      'Accept-Encoding': 'gzip',
      'If-Match': etag,
      'Content-Length': Buffer.byteLength(body, 'utf8')
    }
  });
}

export { getRC, putRC };
