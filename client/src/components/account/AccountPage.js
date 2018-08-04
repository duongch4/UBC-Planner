import React from "react";
import { connect } from "react-redux";
import {bindActionCreators} from 'redux';
import PropTypes from "prop-types";
import { Button, Divider, Form, Grid, Header, Message, Table } from "semantic-ui-react";
import * as AccountActions from '../../actions/AccountActions';
import EditPasswordForm from "./EditPasswordForm";
import EditAccountInfoForm from "./EditAccountInfoForm";

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
		//this.setState({student: stateFromChild});
		console.log(this.props);
		console.log(this.state);
		this.toggleEdit();
	}
	
	savePassword(stateFromChild) {
		//var f = this.state.student.password;
	//	this.setState({f: stateFromChild});
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
	
	componentWillReceiveProps(nextProps) {
		if ((this.props.student.sid !== nextProps.student.sid) ||
			(this.props.student.name !== nextProps.student.name) ||
			(this.props.student.email !== nextProps.student.email) ||
			(this.props.student.cohort !== nextProps.student.cohort) ||
			(this.props.student.bm !== nextProps.student.bm)){
			this.setState({student: nextProps.student});
		}
	}
	
    render () {
			if (this.state.isEditing) {
				return (
				<Grid columns = {2} stackable>
				<Grid.Column>
				<Header as='h1' content ='Account information' />
				<EditAccountInfoForm 
					student = {this.state.student}
					onChange = {this.updateAccountInfo}
					onSave = {this.saveAccountInfo}/>
				</Grid.Column>
				<Grid.Column>
				<Header as='h1' content ='Edit password' />
					<EditPasswordForm 
							student = {this.state.student}
							onSave = {this.savePassword}
						/>
				</Grid.Column>
				</Grid>				
				);
			}
			else {
				return (
					<Grid columns = {2} stackable>
					<Grid.Column>
					<Header as='h1' content ='Account information' />
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
					</Grid.Column>
					<Grid.Column>
					<Header as='h1' content ='Edit password' />					
						<EditPasswordForm 
							student = {this.state.student}
							onSave = {this.savePassword}
						/>
					</Grid.Column>
					</Grid>
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
