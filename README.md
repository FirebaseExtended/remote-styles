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
  const getStyles = await initialize(firebaseApp);
  const styles = getStyles('dark_mode');
  styles.insert();
}

importStyles();
```

## Script Tags / Loader Version

`remote-styles` has a sub-package that lazy loads Firebase. This is useful for sites that use script tags instad of module bundling.


```html
<body>
  <div class="text-main config-dark">This can be configured remotely!</div>
  <script src="https://unpkg.com/remote-styles/dist/remote-styles-loader.min.js"></script>
  <script>
      (async function(window, remoteStyles) {
        const getStyles = await remoteStyles.initialize({
          /* config */
        });
        const styles = getStyles('dark_mode');
        styles.insert();
      }(window, window.remoteStyles));
  </script>
</body>
```

## Upload/Download CSS from Remote Config via the CLI

To use the CLI you'll need to download a Service Account from the Firebase Console.


### Downloading CSS
```bash
node_modules/.bin/remote-styles get --key="CSS" --sa="./sa.json" --out="styles.css"
```

### Uploading CSS
```bash
node_modules/.bin/remote-styles put --key="CSS" --sa="./sa.json" styles.css
```
