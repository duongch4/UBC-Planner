import React from "react";
import { connect } from "react-redux";
import Validator from "validator";
import PropTypes from "prop-types";
import { Form, Button, Message } from "semantic-ui-react";
import EditAccountErrorMessage from './EditAccountErrorMessage';
import {doEditAccount} from '../../api/EditAccountApi';

class EditAccountInfoForm extends React.Component {
	state = {
		data: {
			email: this.props.student.email,
			password: this.props.student.password,
			name: this.props.student.name,
			sid: this.props.student.sid,
			bm: this.props.student.bm,
			cohort: this.props.student.cohort,
		},
		loading: false,
		error: {},
		editError: "",
		editSuccess: "",
		emailKey: this.props.student.email
	}
			
	onFieldTextChange = e => this.setState({data: {...this.state.data, [e.target.name]:e.target.value}});
	
	onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ editError: "" });
        console.log(error);
        
        if (Object.keys(error).length === 0 && error.constructor === Object) {
            this.props.doEditAccount(this.state)
                .then((data) => {
                    this.setState({ editSuccess : "Account successfully edited." });
                    setTimeout(() => {
                        this.props.onSave();
                    }, 1500);
                })
                .catch(function (e) {
                    console.log("Account edit failure");
                    this.setState({ editError : e && e.response && e.response.data && e.response.data.message});
                }.bind(this));
			};
		}

    validate = data => {
        const error = {};
        if (!data.name) error.name = "Cannot be blank";
        if (!data.sid) error.sid = "Cannot be blank";
        if (!data.bm) error.bm = "Cannot be blank";
        if (!data.cohort) error.cohort = "Cannot be blank";     
        if (!data.email) error.email = "Cannot be blank";
        else if (!Validator.isEmail(data.email)) error.email = "Invalid email address";
        return error;
    }
	
	render() {
		return(
			<div id = "editaccountinfoform">
			{this.state.editError && <Message error>{this.state.editError}</Message>}
			
			<Form onSubmit = {this.onSubmit} >
				<Form.Field error={!!this.state.error.name}>
					<label htmlFor='name'>Name</label>
                    {this.state.error.name && <EditAccountErrorMessage text={this.state.error.name}/>}
                    <input
                        type='text'
                        name='name'
                        value={ this.state.data.name }
                        placeholder = {this.state.data.name}
                        onChange={this.onFieldTextChange}/>		
                </Form.Field>	
				<Form.Field error={!!this.state.error.sid }>
					<label htmlFor='sid'>Student Number</label>
                    {this.state.error.sid && <EditAccountErrorMessage text={this.state.error.sid}/>}
                    <input
                        type='number'
                        name='sid'
                        value={ this.state.data.sid }
                        placeholder = {this.state.data.sid }
                        onChange={this.onFieldTextChange}/>
                </Form.Field>	 
				<Form.Field error={!!this.state.error.bm }>
					<label htmlFor='bm'>Bridging Module</label>
                    {this.state.error.bm && <EditAccountErrorMessage text={this.state.error.bm}/>}
                    <input
                        type='text'
                        name='bm'
                        value={ this.state.data.bm }
                        placeholder = {this.state.data.bm}
                        onChange={this.onFieldTextChange}/>
                </Form.Field>
				<Form.Field error={!!this.state.error.cohort}>
					<label htmlFor='cohort'>Cohort</label>
                    {this.state.error.cohort && <EditAccountErrorMessage text={this.state.error.cohort}/>}
                    <input
                        type='text'
                        name='cohort'
                        value={ this.state.data.cohort }
                        placeholder = {this.state.data.cohort}
                        onChange={this.onFieldTextChange}/>
                </Form.Field>	 	        
				<Form.Field error={!!this.state.error.sid}>
					<label htmlFor='email'>Email</label>
                    {this.state.error.email && <EditAccountErrorMessage text={this.state.error.email}/>}
                    <input
                        type='text'
                        name='email'
                        value={ this.state.data.email }
                        placeholder = {this.state.data.email}
                        onChange={this.onFieldTextChange}/>
                </Form.Field>	                                 
			<Button id = "Edit-Account-button">Save changes</Button>
			</Form>
			</div>);
	}
}

EditAccountInfoForm.propTypes = {
	student: PropTypes.object.isRequired,
	onSave: PropTypes.func.isRequired
};

export default connect (null, {doEditAccount}) (EditAccountInfoForm);
