import React from 'react';
import Validator from 'validator';
import {lostPassword} from '../../api/LoginApi';
import LoginErrorMessage from '../login/LoginErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";

class ForgotPasswordForm extends React.Component {

    state = {
        data: {
            email: "",
        },
        loading: false,
        error: {},
        forgotPasswordSuccess: "",
        forgotPasswordError: "",
    };

    onSubmit = () => {

        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ forgotPasswordError: "" });

        if (Object.keys(error).length === 0 && error.constructor === Object) {
            lostPassword(this.state.data)
                .then((data) => {
                    this.setState({ forgotPasswordSuccess: data.message});
                })
                .catch(function (e) {
                    this.setState({ forgotPasswordError :  e.response.data.error });
                }.bind(this));
        }
    };

    validate = data => {
        const error = {};

        if (!data.email)
            error.email = "Can not be blank";
        else if (!Validator.isEmail(data.email))
            error.email = "Invalid email address";

        return error;
    };

    onFieldTextChange = e => this.setState({data: {...this.state.data, [ e.target.name ]: e.target.value}});

    render() {
        const {data, error, forgotPasswordSuccess, forgotPasswordError} = this.state;
        return (
            <div>

                {forgotPasswordSuccess && <Message positive>{ forgotPasswordSuccess }</Message>}
                {forgotPasswordError && <Message negative>{ forgotPasswordError }</Message>}

                <Form onSubmit={ this.onSubmit }>
                    <Form.Field error = {!!error.email}>
                        <label htmlFor = 'email'>Email</label>
                        {error.email &&  <LoginErrorMessage text = {error.email} /> }
                        <input
                            type='text'
                            name='email'
                            placeholder='username@ugrad.cs.ubc.ca'
                            value={data.email}
                            onChange={this.onFieldTextChange} />
                    </Form.Field>
                    <Button id = 'Login-button' fluid> Send </Button>
                </Form>
            </div>
        );
    }
}

export default ForgotPasswordForm;
