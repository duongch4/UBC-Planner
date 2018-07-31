import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Input} from "semantic-ui-react";
import {updateStudentInfo} from "../../api/LoginApi";

class AccountInfo extends React.Component {

    state = {
        isEditMode: false,
        fieldValue: this.props.fieldValue
    }

    onClick = () => {
        this.setState({isEditMode: true});
        this.props.onClick(this);
    }

    onSubmit = e => {
        this.setState({isEditMode: false})

        const { fieldName } = this.props;
        const { fieldValue } = this.state;


        let data = { email: this.props.email };
        data[fieldName] = fieldValue;
        console.log(data);

        this.props.updateStudentInfo(data);
    }

    onChangeText = e => this.setState({ ...this.state, fieldValue: e.target.value });

    render() {
        const {isEditMode, fieldValue} = this.state;
        const {fieldName, fieldType} = this.props;
        return (
            <span className={'student-info' + isEditMode? "edit":""} onClick={this.onClick}>
                {!isEditMode && <span class="editable">{fieldValue}</span>}
                {isEditMode && (
                    <Form onSubmit={this.onSubmit}
                          size={'mini'}
                    >
                        <Input value={fieldValue}
                               onChange={this.onChangeText}
                               name={fieldName}
                               type={fieldType}
                               autofocus
                        />
                    </Form>
                )}
            </span>
        )
    }
}

AccountInfo.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.object.isRequired,
    fieldType: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
}

export default connect (
    null,
    {updateStudentInfo}
) (AccountInfo);
