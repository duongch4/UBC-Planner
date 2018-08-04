import React from "react";
import Validator from 'validator';
import { connect } from "react-redux";
import { Button, Form, Header, Icon, Input, Message } from "semantic-ui-react";
import PropTypes from "prop-types";
import EditPasswordErrorMessage from './EditPasswordErrorMessage';
import { doEditPassword } from '../../api/EditAccountApi';

class EditPasswordForm extends React.Component {
	state = {
		data: {
			email: this.props.student.email,
			currentpasswordonrecord: this.props.student.password,
			currentpasswordentered: "",
			newpassword: "",
			confirmnewpassword: ""
		},
		loading: false,
		error: {},
		editError: "",
		editSuccess: "",
		submitted: false
	};

/*	shouldComponentUpdate = (props) => {
		this.setState({
		data: {
			email: props.student.email,
			currentpasswordonrecord: props.student.password,
			currentpasswordentered: "",
			newpassword: "",
			confirmnewpassword: ""
		},
		loading: false,
		error: {},
		editError: "",
		editSuccess: ""
	});
	
	console.log('didupdate', this.state);

		}
		* */
		
	componentWillReceiveProps(nextProps) {
		if (nextProps.student.password != this.state.data.currentpasswordonrecord) {
			
			this.setState( {
			data: {
			email: nextProps.student.email,
			currentpasswordonrecord: nextProps.student.password,
			currentpasswordentered: "",
			newpassword: "",
			confirmnewpassword: ""
		},
		loading: false,
		error: {},
		editError: "",
		editSuccess: ""
	});

	}
}	
	
	onFieldTextChange = e => this.setState({data: {...this.state.data, [e.target.name]:e.target.value}});
	
	onSubmit = () => {
		const error = this.validate(this.state.data);
		this.setState( {error: error});
        if (Object.keys(error).length === 0 && error.constructor === Object) {
            this.props.doEditPassword(this.state.data)
			.then((data) => {
                    this.setState({ editSuccess : "Password successfully updated." });	
                    this.setState({ submitted: true});				
			})
            .catch(function (e) {
                   console.log("Account update failure");
                    this.setState({ editError : e && e.response && e.response.data && e.response.data.message});
                }.bind(this));
		};
	}				
	
	validate = data => {
		const error  = {};
		if (data.currentpasswordentered.length < 1) {
			error.currentpasswordentered = "Please enter your current password.";
		}
		if (data.currentpasswordentered.length >= 1 && data.currentpasswordentered.valueOf() !== data.currentpasswordonrecord.valueOf()) {
			error.currentpasswordentered = "Password entered does not match password on file. Please retry.";
		}
		if (data.newpassword.length < 1) {
			error.newpassword = "Please enter a new password";
		}
		if (data.newpassword.length >= 1 && data.newpassword.valueOf() === data.currentpasswordonrecord.valueOf()) {
			error.newpassword = "New password must be different from current passoword.";
		}
		if (data.confirmnewpassword.length < 1 ) {
			error.confirmnewpassword = "Please type in your new password again.";			
		}
		if (data.newpassword.valueOf() !== data.confirmnewpassword.valueOf()) {
			error.confirmnewpassword = "Please make sure your passwords match.";
		}
		return error;
	}

	render() {
		
		if (this.state.submitted === false) {
		
		
		const { confirmnewPassword, newPassword } = this.state.data;
		return(
			<div id = "editpasswordform">
			{this.state.editError && <Message error>{this.state.editError}</Message>}
			{this.state.editSuccess && <Message success>{this.state.editSuccess}</Message>}
			<Form onSubmit = {this.onSubmit}>			
			<Form.Field error = { !!this.state.error.currentpasswordentered }>
			<label htmlFor = 'currentpasswordentered'>Current Password</label>
                {this.state.error.currentpasswordentered && <EditPasswordErrorMessage text={this.state.error.currentpasswordentered}/>}
                <Input
					type = 'password'
                    name = 'currentpasswordentered'
                    placeholder = 'Current Password'
                    value = {this.state.data.currentpasswordentered}
                    onChange = {this.onFieldTextChange}/>
            </Form.Field>            
            <Form.Field error = { !!this.state.error.newpassword }>
            <label htmlFor='newpassword'>New Password</label>
                {this.state.error.newpassword && <EditPasswordErrorMessage text={this.state.error.newpassword}/>}            
            <Input
				type = 'password'
				name = 'newpassword'
				placeholder = 'New Password'
				value = {newPassword}
				onChange = {this.onFieldTextChange}/>
            </Form.Field>
            <Form.Field error = { !!this.state.error.confirmnewpassword }>
            <label htmlFor='confirmnewpassword'>Confirm New Password</label>
            {this.state.error.confirmnewpassword && <EditPasswordErrorMessage text={this.state.error.confirmnewpassword}/>}
            <Input
				type = 'password'
				name = 'confirmnewpassword'
				placeholder = 'Confirm New Password'
				value = {confirmnewPassword}
				onChange = {this.onFieldTextChange}/>
            </Form.Field>                
            <Button id='EditPassword-button'> Submit </Button>
            </Form>   
            </div>       
		);
	}
	else {
		return (
			<div id = "passwordconfirmmessage">
			<Message positive icon>
			<Icon name = 'check'check />
			<Message.Content>
			<Message.Header>Password successfully updated.</Message.Header>
			</Message.Content>
			</Message>
			</div>);
		}
	};
}

const mapStateToProps = state => ({
   student: state.student.info
})

EditPasswordForm.propTypes = {
	student: PropTypes.object.isRequired
};

export default connect (mapStateToProps, {doEditPassword})(EditPasswordForm)
