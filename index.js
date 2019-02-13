/* eslint-disable no-console */
const readline = require('readline');
const fs = require('fs');
const childProcess = require('child_process')

const choices = [];
const toCopy = [];
const toDelete = ['./src/App.js', './src/App.css', './src/App.test.js', './src/index.css'];
const dependencies = ['node-sass', 'prop-types', 'redux', 'react-redux', 'redux-thunk', 'connected-react-router', 'history', 'react-router-dom'];
const devDependencies = ['husky', 'eslint-config-standard-react', 'eslint-plugin-babel', 'eslint-plugin-promise', 'eslint-plugin-react'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (target) => () => new Promise((resolve) => {
  rl.question(`Do you intend to use ${target}?\n`, (answer) => {
    if (answer[0].toLowerCase() === 'y') {
      choices.push(target);
      rl.write(`Sounds good. Adding ${target}.\n\n`);
      resolve();
    } else {
      rl.write(`OK. No ${target}.\n\n`);
      resolve();
    }
  });
});

const say = (text) => new Promise((resolve) => {
  rl.write(text);
  resolve()
});

const copy = array => {
  array.forEach(el => toCopy.push(el));
};

say(`Welcome to the Blink React boilerplate generator!\n`)
  .then(say(`This boilerplate includes Redux, Thunk, Connected-React Router, SCSS, ESLINT, and more!\n`))
  .then(say(`-------------------------------------------------\n`))
  .then(say(`You've got some options.\n`))
  .then(say(`Please answer one of 'y' or 'n'.\n`))
  .then(say(`----------------------------------'.\n`))
  .then(ask('Netlify Functions'))
  .then(() => say(`You chose to add: \n${ choices.map(choice => `- ${choice}`).join('\n') }\n\n`))
  .then(() => {
    rl.write('Ready to prep your boilerplate!');
    console.log(`Working in: ${__dirname}`);
    // try {
    //   copy([
    //     { from: './setup/src/redux/createStore.js' },
    //     { from: './setup/src/redux/reducers/index.js' },
    //     { from: './setup/src/redux/reducers/breakpoint.js' },
    //     { from: './setup/src/containers/AppContainer/index.js' },
    //     { from: './setup/src/containers/AppContainer/AppContainer.scss' },
    //     { from: './setup/src/routes/index.js' },
    //     { from: './setup/src/utils/responsiveHelpers.js' },
    //     { from: './setup/generate.js' },
    //     { from: './setup/.gitignore' },
    //     { from: './setup/.eslintrc' },
    //     { from: './setup/.eslintignore' },
    //     { from: './setup/.circleci/config.yml' }
    //   ]);
    //
    //   if (choices.includes('Netlify Functions')) {
    //     copy([
    //       { from: './setup/netlify.lambda.toml', to: './netlify.toml' },
    //       { from: './setup/src/setupProxy.js' }
    //     ]);
    //     dependencies.push('netlify-lambda');
    //     dependencies.push('http-proxy-middleware');
    //   } else {
    //     copy([
    //       { from: './netlify.toml' }
    //     ])
    //   }
    //
    //   toCopy.forEach(pathObj => {
    //     const to = pathObj.to || pathObj.from.replace('/setup', '');
    //     const dirPath = to.split('/').slice(0, -1).join('/');
    //     console.log(`Making directory if not present: ${dirPath}..`);
    //     fs.mkdirSync(dirPath, { recursive: true });
    //     console.log(`Copying file from ${pathObj.from} to ${to}...`)
    //     fs.copyFileSync(pathObj.from, pathObj.to || pathObj.from.replace('/setup', ''));
    //   });
    //
    //   const scripts = {
    //     "g": "node generate.js",
    //     "s": "yarn start",
    //     "t": "yarn test",
    //     "lint": "eslint .",
    //     "lint:fix": "eslint . --fix",
    //     "l": "yarn lint:fix",
    //     "start": "run-p start:**",
    //     "start:app": "NODE_PATH=src/ react-scripts start",
    //     "start:lambda": "NODE_PATH=src/ netlify-lambda serve src/lambda",
    //     "build": "NODE_PATH=src/ run-p build:**",
    //     "build:app": "NODE_PATH=src/ react-scripts build",
    //     "build:lambda": "NODE_PATH=src/netlify-lambda build src/lambda",
    //     "test": "NODE_PATH=src react-scripts test",
    //     "eject": "NODE_PATH=src react-scripts eject"
    //   };
    //
    //   const husky = {
    //     "hooks": {
    //       "pre-commit": "yarn l"
    //     }
    //   };
    //
    //   toDelete.forEach((file) => {
    //     console.log(`Deleting ${file}.\n`);
    //     fs.unlinkSync(file);
    //   });
    //
    //   const packageJson = JSON.parse(fs.readFileSync('./package.json'));
    //   packageJson.scripts = scripts;
    //   packageJson.husky = husky;
    //
    //   console.log('Updating package.json');
    //   fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    //
    //   console.log('Adding dependencies...');
    //   childProcess.execSync(`yarn add ${dependencies.join(' ')}`);
    //
    //   console.log('Adding dev dependencies...');
    //   childProcess.execSync(`yarn add -D ${devDependencies.join(' ')}`);
    //
    //   rl.write('App configured!! You\'re good to go!');
    // } catch (err) {
    //   console.log(err);
    // }
    rl.close();
  });
