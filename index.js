#!/usr/bin/env node
var readline = require('readline');
var fs = require('fs');
var childProcess = require('child_process')

var choices = [];
var toCopy = [];
var toDelete = ['src/App.js', 'src/App.css', 'src/App.test.js', 'src/index.css'];
var dependencies = ['node-sass', 'prop-types', 'redux', 'react-redux', 'redux-thunk', 'connected-react-router', 'history', 'react-router-dom'];
var devDependencies = ['husky', 'eslint-config-standard-react', 'eslint-plugin-babel', 'eslint-plugin-promise', 'eslint-plugin-react'];

var packageJson = JSON.parse(fs.readFileSync('./package.json'));
console.log(`RUNNING VERSION ${packageJson.version}\n\n`);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var ask = (target) => () => new Promise((resolve) => {
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

var say = (text) => new Promise((resolve) => {
  rl.write(text);
  resolve()
});

var copy = array => {
  array.forEach(el => toCopy.push(el));
};

say(`React++ boilerplate generator:\n`)
  .then(say(`This boilerplate includes Redux, Thunk, Connected-React Router, SCSS, ESLint, and more!\n`))
  .then(say(`-------------------------------------------------\n\n`))
  .then(say(`You've got some options.\n`))
  .then(say(`Please answer one of 'y' or 'n'.\n`))
  .then(say(`----------------------------------'.\n\n`))
  .then(ask('Netlify Functions'))
  .then(() => say(`You chose to add: \n${ choices.map(choice => `- ${choice}`).join('\n') }\n\n`))
  .then(() => {
    var appDir = process.cwd();
    console.log('APP DIRECTORY', appDir, '\n');
    try {
      copy([
        { from: './setup/src/redux/createStore.js' },
        { from: './setup/src/redux/reducers/index.js' },
        { from: './setup/src/redux/reducers/breakpoint.js' },
        { from: './setup/src/containers/AppContainer/index.js' },
        { from: './setup/src/containers/AppContainer/AppContainer.scss' },
        { from: './setup/src/routes/index.js' },
        { from: './setup/src/utils/responsiveHelpers.js' },
        { from: './setup/generate.js' },
        { from: './setup/.gitignore' },
        { from: './setup/.eslintrc' },
        { from: './setup/.eslintignore' },
        { from: './setup/.circleci/config.yml' },
        { from: './setup/.circleci/config.yml' }
      ]);

      if (choices.includes('Netlify Functions')) {
        copy([
          { from: './setup/netlify.lambda.toml', to: 'netlify.toml' },
          { from: './setup/src/setupProxy.js' }
        ]);
        dependencies.push('netlify-lambda');
        dependencies.push('http-proxy-middleware');
      } else {
        copy([
          { from: './setup/netlify.toml' }
        ])
      }

      console.log('COPYING\n');
      console.log('--------------------------------------\n');
      toCopy.forEach(pathObj => {
        var to = [appDir, (pathObj.to || pathObj.from.replace('./setup/', ''))].join('/');
        var dirPath = to.split('/').slice(0, -1).join('/');
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`- From ${pathObj.from} to ${to}...`)
        fs.copyFileSync(pathObj.from, to);
      });

      console.log('- README');
      fs.copyFileSync([appDir, 'README.md'].join('/'), [appDir, 'docs/create-react-app.md'].join('/'));
      fs.copyFileSync('./setup/README.md', [appDir, 'README.md'].join('/'));
      console.log('--------------------------------------\n');

      var scripts = {
        "g": "node generate.js",
        "s": "yarn start",
        "t": "yarn test",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "l": "yarn lint:fix",
        "start": "run-p start:**",
        "start:app": "NODE_PATH=src/ react-scripts start",
        "start:lambda": "NODE_PATH=src/ netlify-lambda serve src/lambda",
        "build": "NODE_PATH=src/ run-p build:**",
        "build:app": "NODE_PATH=src/ react-scripts build",
        "build:lambda": "NODE_PATH=src/netlify-lambda build src/lambda",
        "test": "NODE_PATH=src react-scripts test",
        "eject": "NODE_PATH=src react-scripts eject"
      };

      var husky = {
        "hooks": {
          "pre-commit": "yarn l"
        }
      };

      console.log('DELETING\n');
      console.log('--------------------------------------\n');
      toDelete.forEach((file) => {
        const name = [appDir, file].join('/')
        console.log(`Deleting ${name}.\n`);
        fs.unlinkSync(name);
      });
      console.log('--------------------------------------\n');

      packageJson.scripts = scripts;
      packageJson.husky = husky;

      console.log('UPDATING package.json');
      console.log('--------------------------------------\n');
      fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

      childProcess.execSync(`cd ${appDir}`);
      console.log('--------------------------------------\n');

      console.log(`Operating from directory ${process.cwd()}.\n`)

      console.log('--------------------------------------\n');
      console.log('ADDING DEPENDENCIES...');
      childProcess.execSync(`yarn add ${dependencies.join(' ')}`);
      console.log('--------------------------------------\n');

      console.log('ADDING DEV DEPENDENCIES...');
      childProcess.execSync(`yarn add -D ${devDependencies.join(' ')}`);

      console.log('--------------------------------------\n');

      console.log('APP CONFIGURED!!');
    } catch (err) {
      console.log(err);
    }
    rl.close();
  });
