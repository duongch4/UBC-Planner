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
	<Form action="/" onSubmit = {onSubmit}>
		{successMessage && <p className="success-message">{successMessage}</p>}
		{errors.summary && <p className="error-message">{errors.summary}</p>}
		
		<Form.Field>
		<label htmlFor = 'email'>Email</label>
        <input
          type = 'text'
          name="email"
          placeholder = 'username@ugrad.cs.ubc.ca'
          errorText={ errors.email }
          onChange={ onChange }
          value={ user.email }
        />
      </Form.Field>

      <Form.Field>
      <label htmlFor = 'password'>Password</label>
      <input
              type = 'password'
              name = 'password'
              placeholder = 'Password'
              errorText={errors.password}
              value = { user.password }
              onChange = { onChange } />
         </Form.Field>
        <Button type = 'submit' id = 'Login-button' fluid> Login </Button>
    </Form>
    <Link to ={'/signup'}>Forgot your password?</Link>
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


   




