import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './../../auth/authUser/action';

const Navbar = (props) => {
  const { authActions, authReducer } = props;
  const { logoutUser } = authActions;
  const { isAuthenticated, loading } = authReducer;

  const privateLinks = (
    <ul>
      <li>
        <a onClick={logoutUser} href='/'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const publicLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? privateLinks : publicLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  authActions: PropTypes.object.isRequired,
};

const mapPropsToState = ({ authReducer }) => {
  return {
    authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  };
};

export default connect(mapPropsToState, mapDispatchToProps)(Navbar);
