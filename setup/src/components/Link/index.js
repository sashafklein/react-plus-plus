import React from 'react';
import isExternal from 'is-url-external';
import { Link } from 'react-router-dom';

import { string, any } from 'utils/propTypes';

// Handles external and internal URLs
export const Link = (props) => {
  if (!props.to) {
    throw new Error('Cannot initialize a Link without a "to" prop.');
    return null;
  }

  return isExternal(props.to)
    ? <a { ...props } target="_blank" rel="noopener noreferrer" />
    : <Link { ...props } />
};

Link.propTypes = {
  to: string
};

export default Link;
