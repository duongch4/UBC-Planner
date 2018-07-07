import './App.css';
import React, { Component } from 'react';
import { Route } from "react-router-dom";
import MainHeader from "./components/mainHeader/MainHeader";
import SignupPage from "./components/signup/SignupPage";
import LoginPage from "./components/login/LoginPage";//
import ForgotPasswordPage from "./components/password/ForgotPasswordPage";
import IndexPage from "./components/index/IndexPage";
import DashboardPage from "./components/main/DashboardPage";
import MainPage from "./components/main/MainPage";

// let jwt = localStorage.getItem('jwt');
// if (jwt) {
//     LoginActions.login(jwt);
// }

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainHeader />
          <div className="ui-container">
              <Route path="/" exact component={ IndexPage } />
              <Route path="/signup" exact component={ SignupPage } />
              <Route path="/forgotpassword" exact component={ ForgotPasswordPage } />
              <Route path="/login" exact component={LoginPage} />
              <Route path="/dashboard" exact component={DashboardPage} />
              <Route path="/mainpage" exact component={MainPage} />
          </div>
      </div>
    );
  }
}

export default App;
