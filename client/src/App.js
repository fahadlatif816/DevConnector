import React, { Fragment, useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/containers/Navbar/index';
import Landing from './components/containers/Landing/index';
import Register from './components/auth/Register/index';
import Alert from './components/containers/alert';
import Login from './components/auth/Login/index';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import { authUser } from './components/auth/authUser/action';
import PrivateRoute from './components/Routing/PrivateRoute';
import Dashboard from './components/Dashboard/index';
import CreateProfile from './components/Create-Profile/index';
import EditProfile from './components/Edit-Profile';
import AddEducation from './components/Add-Education';
import AddExperience from './components/Add-Experience';

const App = () => {
  useEffect(() => {
    store.dispatch(authUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
