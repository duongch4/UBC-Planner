import React from "react";
//import Validator from "validator";
import PropTypes from "prop-types";
import LoginApi from '../../api/LoginApi';
import SignupErrorMessage from './SignupErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
	<div>
	<Form error action="/" onSubmit={onSubmit}>

       {errors.summary && <p className="error-message">{errors.summary}</p>}

      
      <Form.Input fluid
		 label='Name'
         type='text'
         name='name'
         placeholder='Your Name'
         value={ user.name }
         onChange={ onChange }/>
         <Message error content = {errors.name} />

       <Form.Input fluid
		 label='Email'
         type='text'
         name='email'
         placeholder='username@ugrad.cs.ubc.ca'
         value={user.email}
         onChange={onChange} />
         <Message error content = {errors.email} />

        <Form.Input fluid
         label='Password'
         type='password'
         name='password'
         placeholder='Password'
         value={user.password}
         onChange={onChange}/>
         <Message error content = {errors.password } />


     <Button type='submit' className='Signup-button' id='Signup-button' fluid> Submit </Button>
     </Form>
     </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;



                   

 



