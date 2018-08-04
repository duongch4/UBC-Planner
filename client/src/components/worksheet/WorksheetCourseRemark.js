import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, TextArea, Button, Icon} from "semantic-ui-react"
import {updateRemarks} from "../../api/WorksheetApi";
import './Worksheet.css'

class WorksheetCourseRemark extends React.Component {

    state = {
        isEditMode: false,
        remarks: this.props.remarks
    };

    componentWillReceiveProps = nextProps => {
        const { remarks } = nextProps;
        this.setState({remarks});
    };

    onClick = () => {
        this.props.onClick(this);
        this.setState({isEditMode: true});
    };

    onSubmit = () => {
        this.props.updateRemarks({
            id: this.props.courseId,
            content: this.state.remarks,
            email: this.props.email
        }).then(res => this.setState({isEditMode: false}))
    };

    onChangeText = (_, e) => this.setState({[e.name]: e.value });

    render() {
        const {isEditMode, remarks} = this.state;
        const {courseId} = this.props;
        return (
            <div onClick={this.onClick}>
                {!isEditMode && <div className="remark-div">{!!remarks? remarks:"  "}</div>}
                {isEditMode && (
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <TextArea rows={1}
                                  value={remarks}
                                  onChange={this.onChangeText.bind(this)}
                                  name={'remarks'}
                                  autoHeight
                                  autofocus
                                  className={'remarks-textarea'}
                        />
                        <Button circular className={'submit-remarks-button'} size={'mini'} compact>Submit</Button>
                    </Form>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    email: state.student.info.email
});

WorksheetCourseRemark.propTypes = {
    courseId    : PropTypes.string.isRequired,
    remarks     : PropTypes.string.isRequired,
    isEditMode  : PropTypes.bool.isRequired,
    onClick     : PropTypes.func.isRequired
};

export default connect (
    mapStateToProps,
    {updateRemarks}
    ) (WorksheetCourseRemark);
