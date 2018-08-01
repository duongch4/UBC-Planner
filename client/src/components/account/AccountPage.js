import React from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from "prop-types";
import { Button, Divider, Form, Header, Message, Table } from "semantic-ui-react";
import * as AccountActions from '../../actions/AccountActions';
import { updateStudentInfoSuccess } from '../../actions/LoginActions';
//import EditPasswordForm from "./EditPasswordForm";
import EditAccountInfoForm from "./EditAccountInfoForm";
import {updateStudentInfo} from "../../api/LoginApi";

class AccountPage extends React.Component {
	constructor (props, context) {
		super (props, context);
		this.state = {
			isEditing: false,
			student: this.props.student
		};
		this.saveAccountInfo = this.saveAccountInfo.bind(this);
		this.toggleEdit = this.toggleEdit.bind(this);
		this.updateAccountInfo = this.updateAccountInfo.bind(this);
	}
	
	//API call
	saveAccountInfo(event) {
		this.toggleEdit();
	//	event.preventDefault();
	//	this.props.actions.updateAccountInfo(this.state.student);
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
				<div>
				<Header as= 'h1' icon textAlign={'left'}>
				Account information
				</Header>
				<EditAccountInfoForm 
					student = {this.state.student}
					onChange = {this.updateAccountInfo}
					onSave = {this.saveAccountInfo}/>
				<div id = "edit-password">
					<Divider />
					<h3> Edit password </h3>
				</div>
				<div id = "delete-account">
					<Divider />
					<h3> Delete account </h3>
				</div>
				</div>				
				);
			}
			else {
				return (
					<div>
					<div id = "account-info">
						<Header as='h1' icon textAlign={'left'}>
						Account information
						</Header>
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
					<div id = "edit-password">
						<Divider />
						<h3> Edit password </h3>
					</div>
					<div id = "delete-account">
						<Divider />
						<h3> Delete account </h3>
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
