import './App.css';
import React, { Component } from 'react';
import { Route } from "react-router-dom";
import MainHeader from "./components/mainHeader/MainHeader";
import SignupPage from "./components/signup/SignupPage";
import ForgotPasswordPage from "./components/password/ForgotPasswordPage";
import IndexPage from "./components/index/IndexPage";

// let jwt = localStorage.getItem('jwt');
// if (jwt) {
//     LoginActions.login(jwt);
// }

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
          </div>
      </div>
    );
  }
}

export default App;
