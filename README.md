# README

This tool sets up boilerplate on top of a fresh Create React App install, installing and integrating:

- Redux
- Redux Thunk
- Connected React Router
- SCSS
- ESlint (slightly modified AirBnb setup)
- CircleCI
- Netlify
- Base SCSS structure

As well as some homemade tools:

- A breakpoint reducer/wrapper
- A file for generating components

And optionally:

- Netlify Functions
- SCSS Linting
- ImmutableJS

Because it builds *on top* of Create React App, it leverages the preexisting functionality, with limited risk of falling behind on community improvements.

### Usage

You'll generally want to run the latest version, right after using `create-react-app`:

```
npx create-react-app my-new-app
cd my-new-app
git add .
git commit -m 'App created' // In case you want to revert changes
npx react-plus-plus // Follow command-line instructions to configure your install
```

### TODO

Some optional features I hope to add:

- Testing boilerplate and setup
- More common components
