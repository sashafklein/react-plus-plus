/* eslint no-console: 0 */

const fs = require('fs');

const showHelp = () => {
  console.log(`
    Usage: yarn g path/to/ComponentName (exclude src/)
    Flags:
      -h, --help: Show help.
      -r, --redux: Connect component to Redux store.
      -c, --class: Make a class component (defaults to functional).
      -p, --props: Add prop-types.
      -s, --styles: Add scss file
      -d, --dry: Only log actions; don't write files.
  `);
};

const flagHash = {
  r: 'redux',
  c: 'class',
  s: 'styles',
  h: 'help',
  p: 'props',
  d: 'dry'
};

const classTemplate = `export class NAME extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div>NAME</div>
    );
  }
}`;

const functionalTemplate = `export const NAME = () => (
  <div>NAME</div>
);`;

const propTemplate = `const {} = PropTypes;
NAME.propTypes = {

};`;

const scssTemplate = `@import 'styles/_sass-includes.scss';


`;

const lines = [
  { line: 'import React from \'react\';', if: () => true },
  { line: '-import { connect } from \'react-redux\';', if: flags => flags.includes('redux') },
  { line: '-import PropTypes from \'utils/propTypes\';', if: flags => flags.includes('props') },
  { line: '-import \'./NAME.scss\';', if: flags => flags.includes('styles') },
  { line: functionalTemplate, if: flags => !flags.includes('class') },
  { line: classTemplate, if: flags => flags.includes('class') },
  { line: 'const mapStateToProps = state => ({});', if: flags => flags.includes('redux') },
  { line: propTemplate, if: flags => flags.includes('props') },
  { line: 'export default NAME;', if: flags => !flags.includes('redux') },
  { line: 'export default connect(mapStateToProps)(NAME);', if: flags => flags.includes('redux') }
];

const args = process.argv.slice(2);

if (args.length >= 1) {
  const flags = args.filter(a => a[0] === '-').map(f => flagHash[f.replace(/-/g, '')[0]]);
  const path = args.filter(a => a[0] !== '-')[0];
  const split = path.split('/');
  const name = split[split.length - 1];
  let cssPath;

  const folderPath = split.length >= 1
    ? `./src/${split.join('/')}`
    : null;

  if (flags.includes('help')) {
    showHelp();
  } else {
    if (flags.includes('dry')) {
      console.log('Dry run. Not writing files.\n');
    }

    if (folderPath) {
      console.log(`Making directory if not present: ${folderPath}\n`);

      try {
        if (!flags.includes('dry')) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
      } catch (err) {
        console.log('Folder already exists.\n');
      }
    }

    const template = lines.filter(l => l.if(flags))
      .map(l => l.line)
      .join('\n\n')
      .replace(/NAME/g, name)
      .replace(/\n\n-/g, '\n');

    const filePath = `./src/${path}/index.js`;
    console.log(`Writing file ${filePath} with options: ${flags.join(', ')}\n`);

    if (flags.includes('styles')) {
      cssPath = `./src/${path}/${name}.scss`;
      console.log(`Writing scss file ${filePath}/${name}.scss`);
    }

    if (flags.includes('dry')) {
      console.log('WOULD WRITE:\n');
      console.log(template);
    } else {
      fs.writeFileSync(filePath, template);

      if (flags.includes('styles')) {
        fs.writeFileSync(cssPath, scssTemplate);
      }
    }
  }
} else {
  showHelp();
}
