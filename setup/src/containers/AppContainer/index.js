import React from 'react';
import { connect } from 'react-redux';
import { func, oneOfType, node, array, string } from 'prop-types';

import { setActiveBreakpoint } from 'redux/actions';
import { initReduxBreakpoints } from 'utils/responsiveHelpers';

import 'styles/core.scss';
import './AppContainer.scss';

class AppContainer extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props;

    // Track window changes and update global breakpoint object accordingly
    initReduxBreakpoints.call(
      this, window, (breakpointName, breakpointSize, mediaQueryState) =>
        dispatch(setActiveBreakpoint(breakpointName, breakpointSize, mediaQueryState))
    );
  }

  render () {
    const { children } = this.props;

    return (
      <div className="app">
        <div className="pagecontent">
          { children }
        </div>
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: oneOfType([node, array]),
  dispatch: func
};

const mapStateToProps = state => ({
  router: state.router
});

export default connect(mapStateToProps)(AppContainer);
