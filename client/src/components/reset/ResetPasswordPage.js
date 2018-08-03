import './ResetPassword.css';
import React from "react";
import PropTypes from "prop-types";
import ResetPasswordForm from "./ResetPasswordForm";
import GeneralHeader from "../header/GeneralHeader";

export default class ResetPasswordPage extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateFormState = e => this.setState({ authError : e.message });

    handleSubmit = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="Reset-password-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Reset your password" />
                <div className="Reset-password-form-container">
                    <ResetPasswordForm submit = { this.handleSubmit }/>
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
