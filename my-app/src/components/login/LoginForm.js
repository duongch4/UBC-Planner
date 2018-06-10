import React from "react";
import Validator from "validator";
import PropTypes from "prop-types";
import LoginErrorMessage from './LoginErrorMessage';
import LoginApi from '../../api/LoginApi';
import LoginActions from "../../actions/LoginActions";
import { Form, Button, Message } from "semantic-ui-react";

class LoginForm extends React.Component {

    state = {
        data: {
            email: "",
            password: ""
        },
        loading: false,
        error: {},
        authError: ""
    };

    onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({error: error});
        this.setState({authError: ""});

        if (Object.keys(error).length === 0 && error.constructor === Object) {
            LoginApi.doLogin(this.state.data)
                .then((data) => {
                    LoginActions.login(data.jwt);
                })
                .catch(function (e) {
                    this.setState({ authError : e && e.error && e.error.message });
                }.bind(this));
        }
    };

    // _onLoginSuccess = () => this.props.submit();

    // componentDidMount = () => LoginStore.addChangeListener(this._onLoginSuccess);
    //
    // componentWillUnmount = () => LoginStore.removeChangeListener(this._onLoginSuccess);

    validate = data => {
        const error = {};

        if (!data.email) error.email = "Can not be blank";
        else if (!Validator.isEmail(data.email)) error.email = "Invalid email address";

        if (!data.password) error.password = "Can not be blank";

        return error;
    };

    onFieldTextChange = e => this.setState({data: {...this.state.data, [ e.target.name ]: e.target.value}});

    onForgotPasswordClicked = () => this.props.password()

    onSignupClicked = () => this.props.signup();

    render() {
        const {data, error, authError} = this.state;
        return (
            <div>
                {authError && <Message error>{authError}</Message>}
                <Form onSubmit={ this.onSubmit }>

                    <Form.Field error = {!!error.email}>
                        <label htmlFor = 'email'>Email</label>
                        { error.email &&  <LoginErrorMessage text ={error.email} /> }
                        <input
                            type='text'
                            name='email'
                            placeholder='username@ugrad.cs.ubc.ca'
                            value = { data.email }
                            onChange = { this.onFieldTextChange } />
                    </Form.Field>

                    <Form.Field error = {!!error.password}>
                        <label htmlFor = 'password'>Password</label>
                        { error.password && <LoginErrorMessage text={error.password} /> }
                        <input
                            type = 'password'
                            name = 'password'
                            placeholder = 'password'
                            value = { data.password }
                            onChange = { this.onFieldTextChange } />

                    </Form.Field>

                    <Button id = 'Login-button' fluid> Login </Button>

                </Form>
                <a onClick = {this.props.password}>Forgot your password?</a>
               &nbsp;&nbsp;&nbsp;&nbsp;
                <a onClick = {this.props.signup} >Create a new account</a>
            </div>
        );
    }
}

LoginForm.propTypes = {
    password: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired
};

LoginForm.defaultProps = {
    authError: ""
};

export default LoginForm;