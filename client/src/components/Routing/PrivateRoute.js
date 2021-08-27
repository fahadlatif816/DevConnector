import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  authReducer: { isAuthenticated, loading },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? <Redirect to='/login' /> : <Component />
      }
    />
  );
};

PrivateRoute.propTypes = {
  authReducer: PropTypes.object.isRequired,
  component: PropTypes.object.isRequired,
};

const mapPropsToState = ({ authReducer }) => {
  return {
    authReducer,
  };
};

export default connect(mapPropsToState, null)(PrivateRoute);
