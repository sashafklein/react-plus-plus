import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { object } from 'prop-types';

import AppContainer from 'containers/AppContainer';

import Home from './Home';

/**
 * App routes.
 * Path is path match.
 * Additional fields can be added
 */
export const routes = [
  { path: '/', component: Home },
];

/**
 * Defines the base routes of the application.
 */
const Routes = ({ router }) => {
  const { location } = router;
  return (
    <AppContainer>
      <Switch location={ location }>
        {
          routes.map(route => (
            <Route
              path={ route.path }
              component={ route.component }
              exact
              key={ route.path }
            />
          ))
        }
      </Switch>
    </AppContainer>
  );
};

const mapStateToProps = state => ({
  router: state.router
});

Routes.propTypes = {
  router: object
};

export default connect(mapStateToProps)(Routes);
