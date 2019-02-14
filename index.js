#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const childProcess = require('child_process')

const choices = [];
const files = [];
const dependencies = ['node-sass', 'prop-types', 'redux', 'react-redux', 'redux-thunk', 'connected-react-router', 'history', 'react-router-dom'];
const devDependencies = ['husky', 'eslint-config-standard-react', 'eslint-plugin-babel', 'eslint-plugin-promise', 'eslint-plugin-react', 'npm-run-all'];

const toDelete = ['src/App.js', 'src/App.css', 'src/App.test.js', 'src/index.css'];
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

let packageJson = {};

const ask = (target) => () => new Promise((resolve) => {
  rl.question(`Integrate ${target}?\n`, (answer) => {
    if (answer[0].toLowerCase() === 'y') {
      choices.push(target);
    }
    console.log('\n');
    resolve();
  });
});

const say = (text) => new Promise((resolve) => {
  console.log(text);
  resolve()
});

const copy = (fromArr, toArr) => {
  (fromArr || []).forEach(el => toArr.push(el));
};

const makeChoice = choiceName => (yesObject, noObject = {}) => {
  const object = choices.includes(choiceName) ? yesObject : noObject;
  console.log("CHANGES", choiceName, JSON.stringify(object, null, 2));
  copy(object.files, files);
  copy(object.dependencies, dependencies);
  copy(object.devDependencies, devDependencies);
  packageJson.scripts = { ...object.scripts, ...(yesObject.scripts || {}) };
};

say(`React++ boilerplate generator:`)
  .then(say(`This boilerplate includes Redux, Thunk, Connected-React Router, SCSS, ESLint, and more!`))
  .then(say(keyline))
  .then(say(`You've got some options.`))
  .then(say(`Please answer one of 'y' or 'n'.`))
  .then(say(keyline))
  .then(ask('Netlify Functions'))
  .then(ask('SCSS Linting'))
  .then(ask('Immutable'))
  .then(ask('Styleguidist Component Docs'))
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
      packageJson = JSON.parse(fs.readFileSync(appPath('package.json')));
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
      const husky = {
        "hooks": {
          "pre-commit": "yarn l"
        }
      };
      packageJson.scripts = scripts;
      packageJson.husky = husky;

      copy([
        { from: 'setup/src/redux/createStore.js' },
        { from: 'setup/src/redux/reducers/index.js' },
        { from: 'setup/src/redux/reducers/breakpoint.js' },
        { from: 'setup/src/redux/actions.js' },
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
      ], files);

      makeChoice('Netlify Functions')({
        files: [
          { from: 'setup/netlify.lambda.toml', to: 'netlify.toml' },
          { from: 'setup/src/setupProxy.js' },
          { from: 'setup/docs/netlify-functions.md' }
        ],
        dependencies: ['netlify-lambda', 'http-proxy-middleware'],
        scripts: {
          'start:app': scripts.start,
          start: 'run-p start:**',
          'build:app': scripts.build,
          build: 'NODE_PATH=src/ run-p build:**',
          'build:lambda': "NODE_PATH=src/netlify-lambda build src/lambda",
        }
      }, {
        files: [{ from: 'setup/netlify.toml' }]
      });

      makeChoice('SCSS Linting')({
        files: [{ from: 'setup/sass-lint.yml', to: '.sass-lint.yml' }],
        devDependencies: ['sass-lint'],
        scripts: {
          'lint:sass': 'sass-lint -v -q',
          'lint:all': 'run-s lint:**'
        }
      });

      makeChoice('Immutable')({
        dependencies: ['immutable', 'react-immutable-proptypes'],
        files: [{ from: 'setup/src/utils/propTypes.js' }]
      });

      makeChoice('Styleguidist Component Docs')({
        devDependencies: ['react-styleguidist'],
        scripts: {
          'docs:serve': 'npx styleguidist server',
          'docs:build': 'npx styleguidist build'
        },
        files: [{ from: 'setup/styleguide.config.js' }]
      });

      console.log(keyline);
      console.log('COPYING:');
      files.forEach(pathObj => {
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

      console.log('DELETING');
      toDelete.forEach((file) => {
        console.log(`- ${file}`);
        fs.unlinkSync(appPath(file));
      });
      console.log(keyline);

      console.log('UPDATING package.json');
      fs.writeFileSync(appPath('package.json'), JSON.stringify(packageJson, null, 2));
      console.log(keyline);

      console.log('ADDING DEPENDENCIES...\n');
      childProcess.execSync(`yarn add ${dependencies.normal.join(' ')}`);
      console.log(keyline);

      console.log('ADDING DEV DEPENDENCIES...\n');
      childProcess.execSync(`yarn add -D ${devDependencies.dev.join(' ')}`);
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
