import React from "react";
import Validator from "validator";
import PropTypes from "prop-types";
import LoginErrorMessage from './LoginErrorMessage';
import LoginApi from '../../api/LoginApi';
import LoginActions from "../../actions/LoginActions";
import { Form, Button, Message } from "semantic-ui-react";
import { Link } from 'react-router-dom'

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
	<div>
	<Form error action="/" onSubmit = {onSubmit}>
		{successMessage && <p className="success-message">{successMessage}</p>}
		{errors.summary && <p className="error-message">{errors.summary}</p>}
		
		<Form.Input fluid
		  label = 'Email'
          type = 'text'
          name="email"
          placeholder = 'username@ugrad.cs.ubc.ca'
          onChange={ onChange }
          value={ user.email } />
          <Message error content = {errors.email} />

      <Form.Input fluid
			  label = 'Password'
              type = 'password'
              name = 'password'
              placeholder = 'Password'
              value = { user.password }
              onChange = { onChange } />
              <Message error content = {errors.password} />
              
        <Button type = 'submit' id = 'Login-button' fluid> Login </Button>
    </Form>
    <Link to ={'/forgotpassword'}>Forgot your password?</Link>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Link to ={'/signup'}>Create a new account</Link>
  </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;


   




