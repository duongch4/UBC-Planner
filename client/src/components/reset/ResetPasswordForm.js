import React from 'react';
import Validator from 'validator';
import {resetPassword} from '../../api/LoginApi';
import LoginErrorMessage from '../login/LoginErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";

class ResetPasswordForm extends React.Component {

    state = {
        data: {
            password: "",
            retypedPassword: ""
        },
        loading: false,
        error: {},
        resetPasswordSuccess: "",
        resetPasswordError: ""
    };

    onSubmit = () => {

        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ resetPasswordError: "" });

        if (Object.keys(error).length === 0 && error.constructor === Object) {
          var token = window.location.href.split('?token=')[1];
          console.log("reset Password, token = " + token, "password: ", this.state.data.password)
          resetPassword(this.state.data.password, token)
                .then((data) => {
                    this.setState({ resetPasswordSuccess: data.message});
                })
                .catch(function (e) {
                    this.setState({ resetPasswordError : e.response.data.error });
                }.bind(this));
        }
    };

    validate = data => {
        const error = {};

        if (!data.password) error.password = "Can not be blank";
        if (!data.retypedPassword) error.retypedPassword = "Can not be blank";
        if (data.password !== data.retypedPassword) error.retypedPassword = "Password does not match"
        // TODO
        // else if (
        //     data.password.is().min(8)                                    // Minimum length 8
        //     .is().max(100)                                  // Maximum length 100
        //     .has().uppercase()                              // Must have uppercase letters
        //     .has().lowercase()                              // Must have lowercase letters
        //     .has().digits()                                 // Must have digits
        //     .has().not().spaces()                           // Should not have spaces
        //     .is().not().oneOf(['Passw0rd', 'Password123'])  // Blacklist these values
        // )
        //
        //     error.password = "Password criteria unmet";

        return error;
    };

    onFieldTextChange = e => this.setState({data: {...this.state.data, [ e.target.name ]: e.target.value}});

    render() {
        const {data, error, resetPasswordSuccess, resetPasswordError} = this.state;
        return (
            <div>

                {resetPasswordSuccess && <Message positive>{ resetPasswordSuccess }</Message>}
                {resetPasswordError && <Message negative>{ resetPasswordError }</Message>}

                <Form onSubmit={ this.onSubmit }>
                  <Form.Field error = {!!error.password}>
                    <label htmlFor = 'password'>New Password</label>
                    { error.password && <LoginErrorMessage text={error.password} /> }
                    <input
                        type = 'password'
                        name = 'password'
                        placeholder = 'password'
                        value = { data.password }
                        onChange = { this.onFieldTextChange } />

                  </Form.Field>

                  <Form.Field error = {!!error.retypedPassword}>
                      <label htmlFor = 'retypedPassword'>Confirm Password</label>
                      { error.retypedPassword &&  <LoginErrorMessage text ={error.retypedPassword} /> }
                      <input
                          type='password'
                          name='retypedPassword'
                          placeholder='password'
                          value = { data.retypedPassword }
                          onChange = { this.onFieldTextChange }
                      />
                  </Form.Field>

                    <Button id = 'Login-button' fluid> Update </Button>
                </Form>
            </div>
        );
    }
}

export default ResetPasswordForm;
