#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const childProcess = require('child_process')

const choices = [];
const toCopy = [];
const toDelete = ['src/App.js', 'src/App.css', 'src/App.test.js', 'src/index.css'];
const dependencies = ['node-sass', 'prop-types', 'redux', 'react-redux', 'redux-thunk', 'connected-react-router', 'history', 'react-router-dom'];
const devDependencies = ['husky', 'eslint-config-standard-react', 'eslint-plugin-babel', 'eslint-plugin-promise', 'eslint-plugin-react', 'npm-run-all'];
let confirmed = false;

const appDir = process.cwd();

const joinPath = (path, base) => {
  if (path.slice(0, 2) === './') {
    return [base, path.slice(2)].join('/');
  } else {
    return [base, path].join('/');
  }
}

const modulePath = path => joinPath(path, __dirname);
const appPath = path => joinPath(path, appDir);

const localJson = JSON.parse(fs.readFileSync(modulePath('package.json')));

const title = `** REACT PLUS PLUS - VERSION ${localJson.version} **`;
const banner = title.replace(/./g, '*');
const keyline = `\n${title.replace(/./g, '-')}\n`;

console.log('\n');
console.log(banner);
console.log(title);
console.log(banner)

console.log(keyline);
console.log('CONTEXT:')
console.log('- App Directory:', appDir);
console.log('- Module Directory :', __dirname);
console.log(keyline);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (target) => () => new Promise((resolve) => {
  rl.question(`Should we integrate ${target}?\n`, (answer) => {
    if (answer[0].toLowerCase() === 'y') {
      choices.push(target);
      console.log(`Sounds good. Adding ${target}.\n`);
      resolve();
    } else {
      console.log(`OK. No ${target}.\n`);
      resolve();
    }
  });
});

const say = (text) => new Promise((resolve) => {
  console.log(text);
  resolve()
});

const copy = array => {
  array.forEach(el => toCopy.push(el));
};

say(`React++ boilerplate generator:`)
  .then(say(`This boilerplate includes Redux, Thunk, Connected-React Router, SCSS, ESLint, and more!`))
  .then(say(keyline))
  .then(say(`You've got some options.`))
  .then(say(`Please answer one of 'y' or 'n'.`))
  .then(say(keyline))
  .then(ask('Netlify Functions'))
  .then(() => say(choices.length
    ? `You chose to add: \n${ choices.map(choice => `- ${choice}`).join('\n') }`
    : 'You chose to stick with the base option set.'
  ))
  .then(() => new Promise((resolve) => {
    rl.question(`\nIs that configuration correct?\n`, (answer) => {
      confirmed = answer[0].toLowerCase() === 'y'
      resolve();
    });
  }))
  .then(() => {
    if (!confirmed) {
      console.log('OK. Canceling boilerplate generation!');
      rl.close();
      return;
    }

    try {
      copy([
        { from: 'setup/src/redux/createStore.js' },
        { from: 'setup/src/redux/reducers/index.js' },
        { from: 'setup/src/redux/reducers/breakpoint.js' },
        { from: 'setup/src/containers/AppContainer/index.js' },
        { from: 'setup/src/containers/AppContainer/AppContainer.scss' },
        { from: 'setup/src/routes/index.js' },
        { from: 'setup/src/utils/responsiveHelpers.js' },
        { from: 'setup/generate.js' },
        // Hidden files aren't copied, so they're not hidden here
        { from: 'setup/gitignore', to: '.gitignore' },
        { from: 'setup/eslintrc', to: '.eslintrc' },
        { from: 'setup/eslintignore', to: '.eslintignore' },
        { from: 'setup/circleci/config.yml', to: '.circleci/config.yml' },
        { from: 'setup/docs/testing.md' },
        { from: 'setup/docs/decisions.md' },
        { from: 'setup/src/index.js' }
      ]);

      if (choices.includes('Netlify Functions')) {
        copy([
          { from: 'setup/netlify.lambda.toml', to: 'netlify.toml' },
          { from: 'setup/src/setupProxy.js' },
          { from: 'setup/docs/netlify-functions.md' }
        ]);
        dependencies.push('netlify-lambda');
        dependencies.push('http-proxy-middleware');
      } else {
        copy([
          { from: 'setup/netlify.toml' }
        ])
      }

      console.log(keyline);
      console.log('COPYING:');
      toCopy.forEach(pathObj => {
        const to = appPath(pathObj.to || pathObj.from.replace('setup/', ''));
        const from = modulePath(pathObj.from);
        const dirPath = to.split('/').slice(0, -1).join('/');
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`- FROM ${pathObj.from} TO ${to}`)
        fs.copyFileSync(from, to);
      });

      console.log(`- FROM ${ appPath('README.md') } TO ${ appPath('docs/README.md') }`);
      fs.copyFileSync(appPath('README.md'), appPath('docs/create-react-app.md'));
      console.log(`- FROM ${ modulePath('setup/README.md') } TO ${ appPath('README.md') }`);
      fs.copyFileSync(modulePath('setup/README.md'), appPath('README.md'));
      console.log(keyline);

      const scripts = {
        "g": "node generate.js",
        "s": "yarn start",
        "t": "yarn test",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "l": "yarn lint:fix",
        "start": "NODE_PATH=src/ react-scripts start",
        "build": "NODE_PATH=src/ react-scripts build",
        "test": "NODE_PATH=src react-scripts test",
        "eject": "NODE_PATH=src react-scripts eject"
      };

      if (choices.includes('Netlify Functions')) {
        scripts['start:app'] = scripts.start;
        scripts.start = 'NODE_PATH=src/ run-p start:**';
        scripts['build:app'] = scripts.build;
        scripts.build = 'NODE_PATH=src/ run-p build:**';
        scripts['build:lambda'] = "NODE_PATH=src/netlify-lambda build src/lambda";
      }

      const husky = {
        "hooks": {
          "pre-commit": "yarn l"
        }
      };

      console.log('DELETING');
      toDelete.forEach((file) => {
        console.log(`- ${file}`);
        fs.unlinkSync(appPath(file));
      });
      console.log(keyline);

      const packageJson = JSON.parse(fs.readFileSync(appPath('package.json')));
      packageJson.scripts = scripts;
      packageJson.husky = husky;

      console.log('UPDATING package.json');
      fs.writeFileSync(appPath('package.json'), JSON.stringify(packageJson, null, 2));
      console.log(keyline);

      console.log('ADDING DEPENDENCIES...\n');
      childProcess.execSync(`yarn add ${dependencies.join(' ')}`);
      console.log(keyline);

      console.log('ADDING DEV DEPENDENCIES...\n');
      childProcess.execSync(`yarn add -D ${devDependencies.join(' ')}`);
      console.log(keyline);

      console.log('FETCHING LATEST BASE STYLES');
      childProcess.execSync(`git clone git@github.com:weareredshift/base-sass.git styles`);
      childProcess.execSync(`rm -rf ${appPath('styles/.git')}`);
      fs.unlinkSync(appPath('styles/.gitignore'));
      fs.unlinkSync(appPath('styles/core.css'));
      fs.unlinkSync(appPath('styles/README.md'));
      fs.renameSync(appPath('styles'), appPath('src/styles'));
      console.log(keyline);
      console.log('APP CONFIGURED!');
      console.log('You might want to commit these changes.');
      console.log('View README.md for instructions.');
      console.log(keyline);
    } catch (err) {
      console.log(err);
    }
    rl.close();
  });
