import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from './../Loader';

const Landing = (props) => {
  const { authReducer } = props;
  const { isAuthenticated, loading } = authReducer;

  if (isAuthenticated) return <Redirect to='dashboard' />;

  if (loading) return <Loader />;

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Developer Connector</h1>
          <p className='lead'>
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  authReducer: PropTypes.object.isRequired,
};

const mapPropsToState = ({ authReducer }) => {
  return {
    authReducer,
  };
};

export default connect(mapPropsToState, null)(Landing);
