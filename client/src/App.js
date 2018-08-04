import './App.css';
import React, { Component } from 'react';
import { Route } from "react-router-dom";
import MainHeader from "./components/mainHeader/MainHeader";
import SignupPage from "./components/signup/SignupPage";
import ForgotPasswordPage from "./components/password/ForgotPasswordPage";
import IndexPage from "./components/index/IndexPage";
import ResetPasswordPage from "./components/reset/ResetPasswordPage";
import ConfirmEmailPage from "./components/confirm/ConfirmEmailPage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainHeader />
          <div className="ui-container">
              <Route path="/" exact component={ IndexPage } />
              <Route path="/signup" exact component={ SignupPage } />
              <Route path="/forgotpassword" exact component={ ForgotPasswordPage } />
              <Route path="/reset" exact component={ ResetPasswordPage } />
              <Route path="/confirm" exact component={ ConfirmEmailPage } />
          </div>
      </div>
    );
  }
}

export default App;