import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as alertActions from '../../containers/alert/actions';
import * as actions from './actions';
import Loader from './../../containers/Loader';

const Register = (props) => {
  const { actions, alertActions, registerReducer, authReducer } = props;
  const { loading } = registerReducer;
  const { isAuthenticated, loading: loadingAuth } = authReducer;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  if (isAuthenticated) return <Redirect to='/dashboard' />;
  if (loadingAuth) return <Loader />;

  const { name, email, password, password2 } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      alertActions.setAlert({
        msg: 'Password did not matched',
        alertType: 'danger',
      });
    } else {
      console.log('Password matched...');
      const params = {
        name,
        email,
        password,
      };
      actions.registerUser(params);
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
            minLength='6'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Register'
          disabled={loading}
        />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.protoTypes = {
  registerReducer: PropTypes.object.isRequired,
  authReducer: PropTypes.object.isRequired,
};

const mapPropsToState = ({ registerReducer, authReducer }) => {
  return {
    registerReducer,
    authReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    alertActions: bindActionCreators(alertActions, dispatch),
  };
};

export default connect(mapPropsToState, mapDispatchToProps)(Register);
