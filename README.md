# remote-styles

> Load CSS from Firebase Remote Config

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


