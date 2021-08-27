import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actions from './actions';
import Loader from './../../containers/Loader';

const Login = (props) => {
  const { actions, loginReducer, authReducer } = props;
  const { loading } = loginReducer;
  const { isAuthenticated, loading: loadingAuth } = authReducer;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  if (isAuthenticated) return <Redirect to='/dashboard' />;
  if (loadingAuth) return <Loader />;

  const { email, password } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    const params = {
      email,
      password,
    };
    actions.loginUser(params);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Login'
          disabled={loading}
        />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  loginReducer: PropTypes.object.isRequired,
  authReducer: PropTypes.object.isRequired,
};

const mapPropsToState = ({ loginReducer, authReducer }) => {
  return {
    loginReducer,
    authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapPropsToState, mapDispatchToProps)(Login);
