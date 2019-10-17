# remote-styles

> Load CSS from Firebase Remote Config

## Install
```bash
npm i remote-styles firebase
# OR
yarn add remote-styles firebase
```

## Basic Example

Webpack/Module Bundler usage

```ts
import { initialize } from 'remote-styles';

async function importStyles() {
  // Be smart and lazy load. Dynamic styles
  // are not likely needed for page load.
  const firebase = await import('firebase/app');
  await import('firebase/analytics');
  await import('firebase/remote-config');

  const firebaseApp = firebase.initializeApp({ 
    /* config */ 
  });
  const remoteStyles = await initialize(firebaseApp);
  const styles = remoteStyles('dark_mode');
  styles.insert();
}

importStyles();
```

## Loader Version

`remote-styles` has a sub-package that lazy loads Firebase. This is useful for sites that use script tags instad of module bundling.


```html
<body>
  <script src="/remote-styles-loader.js"></script>
  <script>
      (async function(window, rs) {
        const remoteStyles = await rs.initialize({
          /* config */
        });
        const styles = remoteStyles('dark_mode');
        styles.insert();
      }(window, window.rs));
  </script>
</body>
```

## Storing CSS in Remote Config

```bash
remote-styles --sa="./sa.json" style.css
```
