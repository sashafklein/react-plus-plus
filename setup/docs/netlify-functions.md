# Netlify Functions

This app integrates Netlify Functions. Full docs [here](https://www.netlify.com/docs/functions/).

Functions should be written in `src/lambdas/functionName.js`, with a separate file for each function. As part of the build process, these functions will be copied into a `lambdas` folder in root, which is Git ignored.

### Usage

To use them locally, just run `yarn start`, which will spin up both the app and a local proxy server which simulates an AWS Lambda.

To make a request to this proxy (and the AWS Lambda in production), make a request to a path with the following structure: `/.netlify/functions/${filename}`.

So, with a lambda located in `src/lambdas/hello.js`, your request should look like:

```
axios.get('/.netlify/functions/hello')
```
