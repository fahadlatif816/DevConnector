import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './../Dashboard/actions';
import Loader from './../containers/Loader';
import ProfileItem from './../Profile-Item';

const Profiles = (props) => {
  console.log(props);
  const {
    actions: { getProfiles },
    dashboardReducer: { profiles, loading },
  } = props;
  useEffect(() => {
    getProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i> Browse and connect with
            Developers
          </p>
          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((elem) => (
                <ProfileItem key={elem._id} profile={elem} />
              ))
            ) : (
              <h4>No Profile Found...</h4>
            )}
          </div>
        </>
      )}
    </>
  );
};

Profiles.propTypes = {
  dashboardReducer: PropTypes.object.isRequired,
};

const mapPropsToState = ({ dashboardReducer }) => {
  return {
    dashboardReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapPropsToState, mapDispatchToProps)(Profiles);
