import React from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from "prop-types";
import { Button, Divider, Form, Header, Message, Table } from "semantic-ui-react";
import * as AccountActions from '../../actions/AccountActions';
//import { updateStudentInfoSuccess } from '../../actions/LoginActions';
import EditPasswordForm from "./EditPasswordForm";
import EditAccountInfoForm from "./EditAccountInfoForm";
//import {updateStudentInfo} from "../../api/LoginApi";
import './Account.css';

class AccountPage extends React.Component {
	constructor (props, context) {
		super (props, context);
		this.state = {
			isEditing: false,
			student: this.props.student
		};
		this.saveAccountInfo = this.saveAccountInfo.bind(this);
		this.savePassword = this.savePassword.bind(this);		
		this.toggleEdit = this.toggleEdit.bind(this);
		this.updateAccountInfo = this.updateAccountInfo.bind(this);
	}
	
	saveAccountInfo(stateFromChild) {
		this.setState({student: stateFromChild});
		this.toggleEdit();
	}
	
	savePassword() {
		//this.forceUpdate();
	}
		
	toggleEdit() {
		this.setState({isEditing: !this.state.isEditing});
	}
  
	updateAccountInfo(event) {
		const field = event.target.name;
		const student = this.state.student;
		student[field] = event.target.value;
		return this.setState({student: student});
	}
	
    render () {
			if (this.state.isEditing) {
				return (
				<div class = "accountwrap">
				<div class = 'accountleft'>
				<div class = "accountblock">
				<h1>
				Account information
				</h1>
				</div>
				<div class = "accountblock">
				<EditAccountInfoForm 
					student = {this.state.student}
					onChange = {this.updateAccountInfo}
					onSave = {this.saveAccountInfo}/>
					</div>
				</div>
				<div class = "accountright" id = "edit-password">
				<div class = "accountblock">
					<h1> Edit password </h1>
					</div>
					<div class = "accountblock">
					<EditPasswordForm 
							student = {this.state.student}
							onSave = {this.savePassword}
						/>
						</div>
				</div>
				</div>				
				);
			}
			else {
				return (
					<div class = "accountwrap">
					<div class = 'accountleft' id = "account-info">
					<div class = 'accountblock'>
						<h1>
						Account information
						</h1>
						</div>
						<div class = 'accountblock'>
						<Table basic = 'very' celled collapsing>
						<Table.Body>
							<Table.Row>
								<Table.Cell>Name</Table.Cell>
								<Table.Cell> { this.state.student.name }</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Student ID</Table.Cell>
								<Table.Cell> { this.state.student.sid } </Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Cohort</Table.Cell>
								<Table.Cell> { this.state.student.cohort } </Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Bridging Module</Table.Cell>
								<Table.Cell> { this.state.student.bm } </Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>Email</Table.Cell>
								<Table.Cell> { this.state.student.email } </Table.Cell>
							</Table.Row>																					
						</Table.Body>
						</Table>
						<Button id = 'Edit-AccountInfo-Button' onClick = { this.toggleEdit }>Edit account information</Button>				
					</div>
					</div>
					<div class = "accountright" id = "edit-password">
					<div class = 'accountblock'>
						<h1> Edit password </h1>
						</div>
						<div class = 'accountblock'>					
						<EditPasswordForm 
							student = {this.state.student}
							onSave = {this.savePassword}
						/>
						</div>
					</div>
					</div>
			);
		}
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(AccountActions, dispatch)
	};
}

const mapStateToProps = state => ({
    student: state.student.info
})

AccountPage.propTypes = {
	student: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage)
