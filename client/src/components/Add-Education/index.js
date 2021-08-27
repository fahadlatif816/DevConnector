import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import * as action from '../Dashboard/actions';
import Loader from './../containers/Loader';

const AddEducation = (props) => {
  const {
    dashboardReducer: { loading },
    action,
    history,
  } = props;

  const [formData, setFormData] = useState({
    school: '',
    study: '',
    fieldofstudy: '',
    current: false,
    to: '',
    from: '',
    description: '',
  });

  const [toDateDisabled, toggleToDate] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    action.addEducation(formData, history);
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { school, study, fieldofstudy, current, to, from, description } =
    formData;

  if (loading) return <Loader />;
  return (
    <>
      <section className='container'>
        <h1 className='large text-primary'>Add Your Education</h1>
        <p className='lead'>
          <i className='fas fa-graduation-cap'></i> Add any school, bootcamp,
          etc that you have attended
        </p>
        <small>* = required field</small>
        <form className='form' onSubmit={(e) => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* School or Bootcamp'
              name='school'
              value={school}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='* Degree or Certificate'
              name='study'
              value={study}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='text'
              placeholder='Field Of Study'
              name='fieldofstudy'
              value={fieldofstudy}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <h4>From Date</h4>
            <input
              type='date'
              name='from'
              value={from}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <p>
              <input
                type='checkbox'
                name='current'
                value='current'
                checked={current}
                onChange={(e) => {
                  setFormData({ ...formData, current: !current });
                  toggleToDate(!toDateDisabled);
                }}
              />{' '}
              Current School or Bootcamp
            </p>
          </div>
          <div className='form-group'>
            <h4>To Date</h4>
            <input
              type='date'
              name='to'
              value={to}
              disabled={toDateDisabled ? 'disabled' : ''}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <textarea
              name='description'
              cols='30'
              rows='5'
              placeholder='Program Description'
              value={description}
              onChange={(e) => onChange(e)}
            ></textarea>
          </div>
          <input type='submit' className='btn btn-primary my-1' />
          <Link className='btn btn-light my-1' to='/dashboard'>
            Go Back
          </Link>
        </form>
      </section>
    </>
  );
};

AddEducation.propTypes = {
  dashboardReducer: PropTypes.object.isRequired,
};
const mapDispatchToProps = (dispatch) => {
  return {
    action: bindActionCreators(action, dispatch),
  };
};

const mapPropsToState = ({ dashboardReducer }) => {
  return {
    dashboardReducer,
  };
};
export default connect(
  mapPropsToState,
  mapDispatchToProps
)(withRouter(AddEducation));
