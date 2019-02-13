# README

This tool sets up boilerplate on top of a fresh Create React App install, installing and integrating:

- Redux
- Redux Thunk
- Connected React Router
- SCSS
- ESlint
- CircleCI
- Netlify

As well as some homemade tools:

- A breakpoint reducer/wrapper
- A file for generating components

And optionally:

- Netlify Functions

### Usage

You'll generally want to run the latest version, right after using `create-react-app`:

```
npx create-react-app my-new-app
cd my-new-app
git add .
git commit -m 'App created' // In case you want to revert changes
npx react-plus-plus
```


### TODO

Add styles substructure.

Some optional features I hope to add:

- Immutable integration
- SASS Linting
- Testing boilerplate and setup
- Component documentation (eg React Styleguidist)
