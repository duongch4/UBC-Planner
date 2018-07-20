import './App.css';
import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import MainHeader from "./components/mainHeader/MainHeader";
import SignupPage from "./components/signup/SignupPage";
import ForgotPasswordPage from "./components/password/ForgotPasswordPage";
import IndexPage from "./components/index/IndexPage";
import MainPage from "./components/main/MainPage";
import routes from './routes';
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
            <Redirect to='/mainpage' />
        )} 
      />
    )
  }
}

class App extends Component {


    // state = {
    //     response: ''
    // };
    //
    // componentDidMount() {
    //
    //
    //     this.callApi().then(response => {
    //         console.log(response);
    //         this.setState({response: response});
    //     });
    //
    //
    //     // this.callApi()
    //     //     .then(res => this.setState({ response: res.express }))
    //     //     .catch(err => console.log(err));
    // }
    //
    // callApi = async () => {
    //     const response = await fetch('/admin/michelle.huh@hotmail.com');
    //     const body = await response;
    //
    //     if (response.status !== 200) throw Error(body.message);
    //
    //     console.log(response);
    //
    //
    //     return body;
    // };


  render() {
      // const {response} = this.state
    return (
      <div className="App">
          {/*{response}*/}
        <MainHeader />
          <div className="ui-container">
              <Route path="/" exact component={ IndexPage } />
              <Route path="/signup" exact component={ SignupPage } />
              <Route path="/forgotpassword" exact component={ ForgotPasswordPage } />
              <ProtectedRoute path = "/mainpage" component = {MainPage} /> 
          </div>
      </div>
    );
  }
}

export default App;
