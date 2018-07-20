import React from "react";
import Validator from "validator";
import PropTypes from "prop-types";
//import {doSignup} from '../../api/LoginApi';
//import SignupErrorMessage from './SignupErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";

class SignupForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
        user: {
            email: "",
            password: "",
            name: "",
            sid: "",
            isAgreed: false,
            cohort: (new Date()).getFullYear(),
            bm: null
        },
        loading: false,
        errors: {}
        //registrationError: "",
        //registrationSuccess: ""
    };
    
    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
}
    
    processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const sid = encodeURIComponent(this.state.user.sid);
    const isAgreed = encodeURIComponent(this.state.user.agreed);
    const cohort = encodeURIComponent(this.state.user.cohort);
    const bm = encodeURIComponent(this.state.user.bm);
    const formData = `name=${name}&email=${email}&password=${password}&sid=${sid}&isAgreed=${isAgreed}&cohort=${cohort}&bm=${bm}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        localStorage.setItem('successMessage', xhr.response.message);

        // make a redirect
        //this.context.router.replace('/login');
        //this.context.router.history.push('/');
        //this.props.history.push("/");
        this.props.submit();
      } else {
        // failure

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
/*
    onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ registrationError: "" });

        console.log(error);
        if (Object.keys(error).length === 0 && error.constructor === Object) {
            doSignup(this.state.data)
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
*/

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

    // MonFieldTextChange = e => this.setState({data: {...this.state.data, [e.target.name]:e.target.value}});

    render() {
        //const {data, error, registrationError, registrationSuccess} = this.state;
        return (
            <div>
                <Form error action="/" onSubmit={this.processForm}>
                {this.state.errors.summary && <p className="error-message">{this.state.errors.summary}</p>}
			       <Form.Field>
						<label htmlFor='email'>Email</label>
						<input type='text'
						name='email'
						placeholder='username@ugrad.cs.ubc.ca'
						value={this.state.user.email}
						onChange={this.changeUser} />
						<Message error content = {this.state.errors.email} />
						</Form.Field>
                    
			       <Form.Field>
						<label htmlFor='password'>Password</label>
						<input type='password'
						name='password'
						placeholder='Password'
						value={this.state.user.password}
						onChange={this.changeUser}/>
						<Message error content = {this.state.errors.password } />
						</Form.Field>

			       <Form.Field>
						<label htmlFor='name'>Name</label>
						<input type='text'
						name='name'
						placeholder='Your name'
						value={this.state.user.name}
						onChange={this.changeUser}/>
						<Message error content = {this.state.errors.name } />
						</Form.Field>
															  									      
			       <Form.Field>
						<label htmlFor='sid'>Student Number</label>
						<input type='number'
						name='sid'
						value={ this.state.user.sid }
						onChange={ this.changeUser }/>
						<Message error content = {this.state.errors.sid} />
						</Form.Field>
									      
			       <Form.Field>
						<label htmlFor='bm'>Bridging Module</label>
						<input type='text'
						name='bm'
						placeholder='TBD'
						value={ this.state.user.bm }
						onChange={ this.changeUser }/>
						</Form.Field>	

			       <Form.Field>
						<label htmlFor='cohort'>Cohort</label>
						<input type='text'
						name='name'
						placeholder='Cohort'
						value={this.state.user.cohort}
						onChange={this.changeUser}/>
						<Message error content = {this.state.errors.cohort} />
						</Form.Field>						
																							
                    <Button className='Signup-button' id='Signup-button' fluid> Submit </Button>
                </Form>
            </div>
        );
    }
}

SignupForm.propTypes = {
    submit: PropTypes.func.isRequired
};

export default SignupForm;
