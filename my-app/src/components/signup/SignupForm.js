import React from "react";
import Validator from "validator";
import PropTypes from "prop-types";
import LoginApi from '../../api/LoginApi';
import SignupErrorMessage from './SignupErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";

class SignupForm extends React.Component {

    state = {
        data: {
            email: "",
            password: "",
            name: "",
            sid: "",
            isAgreed: false
        },
        loading: false,
        error: {},
        registrationError: "",
        registrationSuccess: ""
    };

    onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ registrationError: "" });

        console.log(error);
        if (Object.keys(error).length === 0 && error.constructor === Object) {
            LoginApi.doSignup(this.state.data)
                .then((data) => {
                    this.setState({ registrationSuccess : data && data.message });
                    setTimeout(() => {
                        this.props.submit();
                    }, 1500);
                })
                .catch(function (e) {
                    console.log("failed");
                    this.setState({ registrationError : e && e.error && e.error.message });
                }.bind(this));
        }
    };

    validate = data => {
        const error = {};

        if (!data.email) error.email = "Can not be blank";
        else if (!Validator.isEmail(data.email)) error.email = "Invalid email address";
        if (!data.password) error.password = "Can not be blank";
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

        if (!data.name) error.name = "Can not be blank";
        if (!data.sid) error.sid = "Can not be blank";

        return error;
    };

    onFieldTextChange = e => this.setState({data: {...this.state.data, [e.target.name]:e.target.value}});


    render() {
        const {data, error, registrationError, registrationSuccess} = this.state;
        return (
            <div>
                {registrationError && <Message error>{registrationError}</Message>}
                {registrationSuccess && <Message positive>{registrationSuccess}</Message>}

                <Form onSubmit={this.onSubmit}>

                    <Form.Field error={!!error.email}>
                        <label htmlFor='email'>Email</label>
                        {error.email &&  <SignupErrorMessage text={error.email}/>}
                        <input
                            type='text'
                            name='email'
                            placeholder='username@ugrad.cs.ubc.ca'
                            value={data.email}
                            onChange={this.onFieldTextChange} />
                    </Form.Field>

                    <Form.Field error={!!error.password}>
                        <label htmlFor='password'>Password</label>
                        {error.password && <SignupErrorMessage text={error.password}/>}
                        <input
                            type='password'
                            name='password'
                            placeholder='Password'
                            value={data.password}
                            onChange={this.onFieldTextChange}/>
                    </Form.Field>

                    <Form.Field error={!!error.name}>
                        <label htmlFor='name'>Name</label>
                        {error.name && <SignupErrorMessage text={ error.name } />}
                        <input
                            type='text'
                            name='name'
                            placeholder='Your Name'
                            value={data.name}
                            onChange={this.onFieldTextChange}/>
                    </Form.Field>

                    <Form.Field error={!!error.sid}>
                        <label htmlFor='sid'>Student Number</label>
                        {error.sid && <SignupErrorMessage text={error.sid}/>}
                        <input
                            type='number'
                            name='sid'
                            value={ data.sid }
                            onChange={this.onFieldTextChange}/>
                    </Form.Field>

                    <Button className='Signup-button' id='Signup-button' fluid> Submit </Button>
                </Form>
            </div>
        );
    }
}

SignupForm.propTypes = {
    submit: PropTypes.func.isRequired,
};

export default SignupForm;