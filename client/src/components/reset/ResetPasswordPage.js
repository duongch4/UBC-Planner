import './ResetPassword.css';
import React from "react";
import PropTypes from "prop-types";
import ResetPasswordForm from "./ResetPasswordForm";
import GeneralHeader from "../header/GeneralHeader";

export default class ResetPasswordPage extends React.Component {
    constructor() {
        super();
    }

    updateFormState = e => this.setState({ authError : e.message });

    render() {
        return (
            <div className="Reset-password-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Reset your password" />
                <div className="Reset-password-form-container">
                    <ResetPasswordForm />
                </div>
            </div>
        );
    }
}

ResetPasswordPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};
