import './Login.css';
import React from "react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import GeneralHeader from "../header/GeneralHeader";

export default class LoginPage extends React.Component {
    constructor() {
        super();

        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div className="Login-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Login Authentication"
                />
                <div className="Login-form-container">
                    <LoginForm history = {this.props.history}
							password={this.props.password} //https://stackoverflow.com/questions/43837212/this-props-history-push-works-in-some-components-and-not-others
                                    // handleForgotPassword}
                                signup={this.props.signup
                                    // this.handleSignup
                                }/>
                </div>
            </div>
        );
    }
}

LoginPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    signup: PropTypes.func.isRequired,
    password: PropTypes.func.isRequired
};
