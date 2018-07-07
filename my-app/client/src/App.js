import './App.css';
import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Link, Redirect, Switch } from "react-router-dom";
import MainHeader from "./components/mainHeader/MainHeader";
import SignupPage from "./components/signup/SignupPage";
import LoginPage from "./components/login/LoginPage";//
import ForgotPasswordPage from "./components/password/ForgotPasswordPage";
import IndexPage from "./components/index/IndexPage";
import DashboardPage from "./components/main/DashboardPage";
import MainPage from "./components/main/MainPage";
import Auth from './modules/Auth.js';

// let jwt = localStorage.getItem('jwt');
// if (jwt) {
//     LoginActions.login(jwt);
// }

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          Auth.isUserAuthenticated() ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainHeader />
          <div className="ui-container">
		      <Switch>
              <Route path="/" exact component={ IndexPage } />
              <Route path="/signup" exact component={ SignupPage } />
              <Route path="/forgotpassword" exact component={ ForgotPasswordPage } />
              <Route path="/login" exact component={LoginPage} />     
              <ProtectedRoute path = "/dashboard" component = {DashboardPage} /> 
              </Switch>
          </div>
      </div>
    );
  }
}

export default App;

//Conditional routing tutorial: https://tylermcginnis.com/react-router-protected-routes-authentication/
//https://stackoverflow.com/questions/39689915/how-do-i-git-push-specific-branch
