import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import Loader from './../containers/Loader';
import { Link } from 'react-router-dom';
import DashboardActions from './../../components/containers/DashboardActions/index';

const Dashboard = ({
  actions: { getCurrentUserProfile },
  authReducer: { loading: authLoading },
  dashboardReducer: { loading: dashboardLoading, profile },
}) => {
  useEffect(() => {
    getCurrentUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (authLoading || dashboardLoading) && !profile?.user ? (
    <Loader />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome{' '}
        {profile?.user && profile?.user?.name}
      </p>
      {profile ? (
        <Fragment>
          <DashboardActions />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info.</p>
          <Link to='/edit-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  authReducer: PropTypes.object.isRequired,
  dashboardReducer: PropTypes.object.isRequired,
};

const mapPropsToState = ({ authReducer, dashboardReducer }) => {
  return {
    authReducer,
    dashboardReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapPropsToState, mapDispatchToProps)(Dashboard);
