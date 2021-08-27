import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = (props) => {
  const { alerts } = props;
  return (
    alerts &&
    alerts.length > 0 &&
    alerts.map((elem) => (
      <div key={elem.id} className={`alert alert-${elem.alertType}`}>
        {elem.msg}
      </div>
    ))
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapPropsToState = (state) => {
  return {
    alerts: state.alertReducer,
  };
};

export default connect(mapPropsToState)(Alert);
