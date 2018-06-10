import React from 'react'
import PropTypes from "prop-types";
import LoginPage from "../login/LoginPage";
import MainPage from "../main/MainPage";
import LoginStore from "../../stores/LoginStore";

class IndexPage extends React.Component {
    state = {
        isLoggedIn: "",
    };

    _onLoginStatusChange = () => this.setState({isLoggedIn:LoginStore.user && LoginStore.user.name});

    componentDidMount = () => LoginStore.addChangeListener(this._onLoginStatusChange);

    componentWillUnmount = () => LoginStore.removeChangeListener(this._onLoginStatusChange);

    handleForgotPassword = () => this.props.history.push("/forgotpassword");

    handleSignup = () => this.props.history.push("/signup");

    render() {
        return (
            <div>
                {!this.state.isLoggedIn && <LoginPage
                    password={this.handleForgotPassword}
                    signup={this.handleSignup}
                /> }
                {!!this.state.isLoggedIn && <MainPage/>}
            </div>);
    }
}

IndexPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default IndexPage;