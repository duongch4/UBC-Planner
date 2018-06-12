import './Signup.css';
import React from "react";
import PropTypes from "prop-types";
import SignupForm from "./SignupForm";
import GeneralHeader from "../header/GeneralHeader";

export default class SignupPage extends React.Component {
    constructor() {
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateFormState = e => {
        this.setState({ authError : e.message })
    };

    handleSubmit = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="Signup-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Sign up" />
                <div className="Login-form-container">
                    <SignupForm submit = { this.handleSubmit } />
                </div>
            </div>
        );
    }
}

SignupPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};