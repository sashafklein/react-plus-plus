// This file contains base prop types, plus any more complex reusable props
// (eg for project-specific objects)
import baseProps from 'prop-types';

export const {
  object, string, func, bool, shape,
  oneOf, oneOfType, array, arrayOf,
  node, element, number, any
} = baseProps;

// Add any custom prop types here (eg for repeated object types)

export const routerType = shape({
  location: {
    pathname: string.isRequired,
    hash: string.isRequired,
    search: string.isRequired
    state: object
  },
  action: string
});

const allProps = {
  ...baseProps,
  routerType
  // Could export other custom props by default as well
};

export default allProps;
