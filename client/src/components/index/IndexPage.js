import React from 'react'
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import LoginPage from "../login/LoginPage";
import MainPage from "../main/MainPage";

class IndexPage extends React.Component {

    handleForgotPassword = () => this.props.history.push("/forgotpassword");

    handleSignup = () => this.props.history.push("/signup");

    render() {
        const {isLoggedIn} = this.props;
        return (
            <div className={"index"}>
                {!isLoggedIn && <LoginPage
                    password={this.handleForgotPassword}
                    signup={this.handleSignup}
                /> }
                {!!isLoggedIn && <MainPage/>}
            </div>);
    }
}

IndexPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default connect (
    state=>{return({isLoggedIn: state.student.isLoggedIn})}
)(IndexPage);