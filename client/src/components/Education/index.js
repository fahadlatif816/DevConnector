import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import * as actions from './../Dashboard/actions';
import { bindActionCreators } from 'redux';

const Education = ({
  dashboardReducer: {
    profile: { education },
  },
  actions: { deleteEducation },
}) => {
  const educations = education.map((elem) => (
    <tr key={elem._id}>
      <td>{elem.school}</td>
      <td className='hide-sm'>{elem.fieldofstudy}</td>
      <td className='hide-sm'>
        <Moment format='YYYY/MM/DD'>{elem.from}</Moment> -{' '}
        {!elem.to ? ' Now' : <Moment format='YYYY/MM/DD'>{elem.to}</Moment>}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => deleteEducation(elem._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hise-sm'>Field of Study</th>
            <th className='hise-sm'>Years</th>
            <th className='hise-sm'>Action</th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
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

export default connect(mapPropsToState, mapDispatchToProps)(Education);
