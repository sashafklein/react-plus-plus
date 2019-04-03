module.exports = {
  extends: 'airbnb',
  rules: {
    'import/no-unresolved': 0,

    // Don't force all objects to be multiline, if they're short.
    'object-curly-newline': 0,

    // Enforce trailing commas for arrays, objects, and imports,
    // but only when they're on multiple lines.
    'comma-dangle': ['error', {
        'arrays': 'only-multiline',
        'objects': 'only-multiline',
        'imports': 'only-multiline',
        'exports': 'never',
        'functions': 'never'
    }],

    // This is just a bad rule, because it involves either disabling the linter
    // or forcing changes when a second import is added.
    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'function-paren-newline': ['error', 'consistent'],

    // The else makes this more explicit.
    'no-else-return': 0,

    // REACT SPECIFIC - Remove in non-React project.

    // Require spaces around JSX interpolation, for readability.
    'react/jsx-curly-spacing': ['always', 2],

    // Don't require default props, because null/undefined defaults are meaningful.
    'react/require-default-props': 0,

    // Don't require JSX file names, because gaearon is right about everything.
    // https://github.com/airbnb/javascript/pull/985#issuecomment-239145468
    'react/jsx-filename-extension': 0,

    // Don't forbid vague prop-types, but do give warnings, because they're not ideal.
    'react/forbid-prop-types': 1,

    'import/no-extraneous-dependencies': 0
  },
  env: {
    // Allow reference to browser globals like 'document'.
    browser: true,

    // REACT SPECIFIC - Remove in non-React project.

    // Allow reference to test globals like 'describe' and 'it'.
    jest: true
  }
}
