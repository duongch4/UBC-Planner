import React from "react";
import { connect } from "react-redux";
import Validator from "validator";
import PropTypes from "prop-types";
import {emailDirectorWorksheet} from '../../api/WorksheetApi';
import LoginErrorMessage from '../login/LoginErrorMessage';
import { Form, Button, Message } from "semantic-ui-react";
import WorksheetPage from '../worksheet/WorksheetPage';

const directorEmail = "wolf@cs.ubc.ca";

class EmailModalForm extends React.Component {

    state = {
        data: {
            to: this.props.student.email, //+ ", " + directorEmail,
            subject: "BCS - Graduation Checklist",
            text: "Hello Steve,\n\n<Write message regarding graduation checklist.> \n\nPlease find attached my graduation checklist. \n\nRegards,\n"
            + this.props.student.name + "\n" + "Student number: " + this.props.student.sid + "\n" + this.props.student.email
        },
        loading: false,
        error: {},
        emailError: "",
        emailSuccess: "",
        showForm: true
    };

    onSubmit = () => {
        const error = this.validate(this.state.data);
        this.setState({ error: error });
        this.setState({ emailError: "" });

        console.log(error);
        if (Object.keys(error).length === 0 && error.constructor === Object) {
          console.log("divToPrint: ", window.document.getElementById('divToPrint'))
          console.log("state data: ", this.state.data)
            emailDirectorWorksheet(this.state.data, window.document.getElementById('divToPrint'))
                .then((result) => {
                    this.setState({ emailSuccess : result.data.message  });
                    this.setState({ showForm : false});
                })
                .catch(function (e) {
                    this.setState({ emailError : e.response.data.error});
                }.bind(this));
        }
    };

    validate = data => {
        const error = {};
        if (!data.to) error.to = "Can not be blank";
      //  else if (!Validator.isEmail(data.email)) error.email = "Invalid email address";
        if (!data.subject) error.subject = "Can not be blank";
        if (!data.text) error.text = "Can not be blank";
        return error;
    };

    onFieldTextChange = e => this.setState({data: {...this.state.data, [e.target.name]:e.target.value}});


    render() {
        const {data, error, emailError, emailSuccess, showForm} = this.state;
        return (
            <div>
                {emailError && <Message error>{emailError}</Message>}
                {emailSuccess && <Message positive>{emailSuccess}</Message>}

                { showForm ? <Form onSubmit={this.onSubmit}>

                    <Form.Field error={!!error.to}>
                        <label htmlFor='to'>To</label>
                        {error.to &&  <LoginErrorMessage text={error.to}/>}
                        <input
                            type='text'
                            name='to'
                            value={data.to}
                            onChange={this.onFieldTextChange} />
                    </Form.Field>

                    <Form.Field error={!!error.subject}>
                        <label htmlFor='subject'>Subject</label>
                        {error.subject && <LoginErrorMessage text={error.subject}/>}
                        <input
                            type='text'
                            name='subject'
                            value={data.subject}
                            onChange={this.onFieldTextChange}/>
                    </Form.Field>

                    <Form.Field error={!!error.text}>
                        <label htmlFor='text'>Message</label>
                        {error.text && <LoginErrorMessage text={ error.text } />}
                        <Form.TextArea
                          autoHeight
                            type='text'
                            name='text'
                            value={data.text}
                            onChange={this.onFieldTextChange}/>
                    </Form.Field>

                    <Form.Field>
                    <label htmlFor='subject'>Your current graduation checklist will be attached.</label>
                    </Form.Field>
                      <Button className='Email-button' id='Email-button' fluid> Submit </Button>
                </Form> : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    student: state.student.info
});


export default connect(
    mapStateToProps
)(EmailModalForm);
