import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { bindActionCreators } from 'redux';
import * as actions from './../Dashboard/actions';

const Experience = ({
  dashboardReducer: {
    profile: { experience },
  },
  actions: { deleteExperience },
}) => {
  const experiences = experience.map((elem) => (
    <tr key={elem._id}>
      <td>{elem.company}</td>
      <td className='hide-sm'>{elem.title}</td>
      <td className='hide-sm'>
        <Moment format='YYYY/MM/DD'>{elem.from}</Moment> -{' '}
        {!elem.to ? ' Now' : <Moment format='YYYY/MM/DD'>{elem.to}</Moment>}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteExperience(elem._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hise-sm'>Job Title</th>
            <th className='hise-sm'>Year</th>
            <th className='hise-sm'>Action</th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </>
  );
};

Experience.propTypes = {
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

export default connect(mapPropsToState, mapDispatchToProps)(Experience);
