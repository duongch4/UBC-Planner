import React from 'react';
import LoginErrorMessage from '../login/LoginErrorMessage';
import { Button, Message } from "semantic-ui-react";

class ConfirmEmailForm extends React.Component {

    state = {
        confirmEmailSuccess: "",
        confirmEmailError: ""
    };

    onSubmit = () => {
    /*  var token = window.location.href.split('?token=')[1];
          confirmEmail(token)
                .then((data) => {
                    this.setState({ confirmEmailSuccess: data.message});
                })
                .catch(function (e) {
                    this.setState({ confirmEmailError : e.response.data.error });
                }.bind(this));*/
    };

    render() {
        const {confirmEmailSuccess, confirmEmailError} = this.state;
        return (
            <div>
                {confirmEmailSuccess && <Message positive>{ confirmEmailSuccess }</Message>}
                {confirmEmailError && <Message negative>{ confirmEmailError }</Message>}
                <Button id = 'Login-button' fluid> Submit </Button>
            </div>
        );
    }
}

export default ConfirmEmailForm;
