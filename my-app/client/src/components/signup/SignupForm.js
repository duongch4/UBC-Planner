import React from "react";
import Validator from "validator";
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
	<Form action="/" onSubmit={this.onSubmit}>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      
      <Form.Field error>
      <label htmlFor='name'>Name</label>
      <input
         type='text'
         name='name'
         placeholder='Your Name'
         value={user.name}
         onChange={onChange}/>
      </Form.Field>

      
       <Form.Field>
       <label htmlFor='email'>Email</label>
      <input
             type='text'
             name='email'
             placeholder='username@ugrad.cs.ubc.ca'
             errorText={errors.email}
             value={user.email}
             onChange={onChange} />
         </Form.Field>

        <Form.Field>
        <label htmlFor='password'>Password</label>
        <input
               type='password'
               name='password'
               placeholder='Password'
               value={user.password}
              onChange={onChange}/>
        </Form.Field>

     <Button className='Signup-button' id='Signup-button' fluid> Submit </Button>
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



                   

 



