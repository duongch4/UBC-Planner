import React from 'react';
import Validator from 'validator';
import LoginApi from '../../api/LoginApi';
import LoginErrorMessage from '../login/LoginErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";

class ForgotPasswordForm extends React.Component {

    state = {
        data: {
            email: "",
        },
        loading: false,
        error: {},
        message: ""
    };

    onSubmit = () => {

        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ message: "" });

        if (Object.keys(error).length === 0 && error.constructor === Object) {
            LoginApi.lostPassword(this.state.data)
                .then((data) => {
                    this.setState({ message: data.message});
                })
                .catch(function (e) {
                    console.log("failed");
                    this.setState({ message : e && e.error && e.error.message });
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
        const {data, error, message} = this.state;
        return (
            <div>

                {message && <Message positive>{ message }</Message>}

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