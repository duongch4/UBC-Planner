import React from "react";
import Validator from "validator";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doLogin} from "../../api/LoginApi";
import LoginErrorMessage from './LoginErrorMessage';
// import LoginApi from '../../api/LoginApi';
// import LoginActions from "../../actions/LoginActions";
import { Form, Button, Message } from "semantic-ui-react";
import Auth from '../../modules/Auth';
import { withRouter } from 'react-router' //For redirecting to /

class LoginForm extends React.Component {
	constructor (props, context) {
		super(props, context);

		const storedMessage = localStorage.getItem('successMessage');
		let successMessage = '';

		if (storedMessage) {
			successMessage = storedMessage;
			localStorage.removeItem('successMessage');
		}    
				
		this.state = {
			user: {
            email: "",
            password: ""
        },
        loading: false,
        errors: {},
        successMessage
        //authError: ""
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }
  
    processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        Auth.authenticateUser(xhr.response.token);

		//Passport tut method
        // change the current URL to / 
        //this.context.router.replace('/');  //Original
        //this.context.router.history.push('/mainpage');
        //this.context.history.push('/mainpage');
        this.props.history.push('/mainpage');
        //Redux method
        //const {doLogin} = this.props;
        //const {data} = this.state;
        //doLogin(data);
        
      } else {
        // failure

        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }


/*    onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({error: error});
        this.setState({authError: ""});

        const {doLogin} = this.props;
        const {data} = this.state;

        if (Object.keys(error).length === 0 && error.constructor === Object) {
            console.log(data);
            doLogin(data).catch(function (e) {
                console.log("errrrrr", e);
                        this.setState({ authError : e && e.error && e.error.message });
                    }.bind(this));
            // LoginApi.doLogin(this.state.data)
            //     .then((data) => {
            //         LoginActions.login(data.jwt);
            //     })
            //     .catch(function (e) {
            //         this.setState({ authError : e && e.error && e.error.message });
            //     }.bind(this));
        }
    };
    

    // _onLoginSuccess = () => this.props.submit();

    // componentDidMount = () => StudentStore.addChangeListener(this._onLoginSuccess);
    //
    // componentWillUnmount = () => StudentStore.removeChangeListener(this._onLoginSuccess);

    validate = data => {
        const error = {};

        if (!data.email) error.email = "Can not be blank";
        else if (!Validator.isEmail(data.email)) error.email = "Invalid email address";

        if (!data.password) error.password = "Can not be blank";

        return error;
    };
*/
    //onFieldTextChange = e => this.setState({data: {...this.state.data, [ e.target.name ]: e.target.value}});

    onForgotPasswordClicked = () => this.props.password()

    onSignupClicked = () => this.props.signup();

    render() {
        //const {data, error, authError} = this.state;
        return (
            <div>
                <Form error action ="/" onSubmit={ this.processForm }>
					{this.state.successMessage && <p className="success-message">{this.state.successMessage}</p>}
					{this.state.errors.summary && <p className="error-message">{this.state.errors.summary}</p>}

                    <Form.Field>
                        <label htmlFor = 'email'>Email</label>
                        <input
                            type='text'
                            name='email'
                            placeholder='username@ugrad.cs.ubc.ca'
                            value = { this.state.user.email }
                            onChange = { this.changeUser }
                            autofocus="true" />
                        <Message error content = {this.state.errors.email} />
                    </Form.Field>

                    <Form.Field error>
                        <label htmlFor = 'password'>Password</label>
                        <input
                            type = 'password'
                            name = 'password'
                            placeholder = 'password'
                            value = { this.state.user.password }
                            onChange = { this.changeUser } />
                            <Message error content = {this.state.errors.password} />
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
    signup: PropTypes.func.isRequired,
    //doLogin: PropTypes.func
};

LoginForm.defaultProps = {
    authError: ""
};

//export default connect ( null, {doLogin} ) (LoginForm);
export default withRouter(connect(null, {doLogin})(LoginForm));
