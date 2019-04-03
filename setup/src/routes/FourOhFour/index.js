import React from 'react';
import { Link } from 'react-router-dom';

export const FourOhFour = () => (
  <div className="four-oh-four">
    <h2 className="mb1">404</h2>
    <p>Page not found.<br />Click <Link to="/">here</Link> to return home.</p>
  </div>
);

export default FourOhFour;
