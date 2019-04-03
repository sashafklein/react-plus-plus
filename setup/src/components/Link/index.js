import React from 'react';
import isExternal from 'is-url-external';
import { Link as BaseLink } from 'react-router-dom';

import { string } from 'utils/propTypes';

// Handles external and internal URLs
export const Link = (props) => {
  const { to } = props;
  if (!to) {
    throw new Error('Cannot initialize a Link without a "to" prop.');
  }

  return isExternal(to)
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    ? <a { ...props } target="_blank" rel="noopener noreferrer" />
    : <BaseLink { ...props } />;
};

Link.propTypes = {
  to: string
};

export default Link;
