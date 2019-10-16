# remote-styles

> Load CSS from Firebase Remote Config

## Install
```
npm i remote-styles firebase
# OR
yarn add remote-styles firebase
```

## Basic Example

```ts
import { initialize } from 'remote-styles/loader';

async function importStyles() {
  const remoteStyles = await initialize({ /* Firebase Config */ });
  const styles = remoteStyles('dark_mode');
  styles.insert();
}

importStyles();
```


