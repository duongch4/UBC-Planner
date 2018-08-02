import './ConfirmEmail.css';
import React from "react";
import PropTypes from "prop-types";
import GeneralHeader from "../header/GeneralHeader";
import { Button } from "semantic-ui-react";
import ConfirmEmailForm from "./ConfirmEmailForm"

export default class ConfirmEmailPage extends React.Component {

    constructor() {
        super();
    }

    updateFormState = e => this.setState({ authError : e.message });

    render() {
        return (
            <div className="Confirm-email-page-container">
                <GeneralHeader
                    iconName="graduation"
                    headerText="BCS Graduation Planner"
                    subHeaderText="Confirm your account" />
                <div className="Confirm-email-form-container">
                    <ConfirmEmailForm />
                </div>
            </div>
        );
    }
}

ConfirmEmailPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};
