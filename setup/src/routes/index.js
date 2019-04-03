import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import { Transition, TransitionGroup } from 'react-transition-group';

import { object } from 'utils/propTypes';
import AppContainer from 'containers/AppContainer';

import Home from './Home';
import FourOhFour from './FourOhFour';

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
      <TransitionGroup>
        <Transition
          key={ location.key }
          timeout={ (location.state && location.state.duration) ? location.state.duration : 400 }
        >
          {(status) => (
            <Switch location={ location }>
              {
                routes.map(route => (
                  <Route
                    path={ route.path }
                    render={ (props) => <route.component { ...props } transitionStatus={ status } /> }
                    exact
                    key={ route.path }
                  />
                ))
              }
              <Route path="*" render={ () => <FourOhFour /> } />
            </Switch>
          )}
        </Transition>
      </TransitionGroup>
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
