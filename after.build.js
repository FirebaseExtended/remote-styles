const shell = require('shelljs');
const { LIB_VERSION } = require('./versions.json');
const { name } = require('./package.json');

if (shell.exec('npm pack ./dist/packages-dist/remote-styles').code !== 0) {
  shell.echo('Pack failed?');
  shell.exit(1);
}

if(shell.exec(`mv ./${name}-${LIB_VERSION}.tgz ./dist/site/remote-styles.tgz`).code !== 0) {
  shell.echo('Move tarball failed?');
  shell.exit(1);
}

if(shell.exec(`cp ./package.site.json ./dist/site/package.json`).code !== 0) {
  shell.echo('copy package.site.json failed?');
  shell.exit(1);
}

shell.cd(`dist/site`);

if(shell.exec(`npm i`).code !== 0) {
  shell.echo('npm i failed?');
  shell.exit(1);
}

if(shell.exec(`npm run webpack`).code !== 0) {
  shell.echo('npm run webpack failed?');
  shell.exit(1);
}
