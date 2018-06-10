import './ForgotPassword.css';
import React from "react";
import PropTypes from "prop-types";
import ForgotPasswordForm from "./ForgotPasswordForm";
import GeneralHeader from "../header/GeneralHeader";

export default class ForgotPasswordPage extends React.Component {
    constructor() {
        super();
    }

    updateFormState = e => this.setState({ authError : e.message });

    render() {
        return (
            <div className="Forgot-password-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Reset you password" />
                <div className="Forgot-password-form-container">
                    <ForgotPasswordForm />
                </div>
            </div>
        );
    }
}

ForgotPasswordPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};