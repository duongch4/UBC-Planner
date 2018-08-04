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
    }

    componentWillReceiveProps = nextProps => {
        const { isEditMode, courseId, remarks } = nextProps;
        this.setState(Object.assign({}, { isEditMode, courseId, remarks }));
    };

    onClick = () => {
        this.setState({isEditMode: true});
        this.props.onClick(this);
    }

    onSubmit = e => {
        this.setState({isEditMode: false})
        // TODO data submit
        //
        // console.log("submittign", {[e.target.name]: e.target.value}, arguments);

        this.props.updateRemarks({
            id: this.props.courseId,
            content: this.state.remarks,
            email: this.props.email
        })
    }

    onChangeText = e => this.setState({ ...this.state, [e.target.name]: e.target.value });

    render() {
        const {isEditMode, remarks} = this.state;
        const {courseId} = this.props;
        return (
            <div onClick={this.onClick}>
                {!isEditMode && <div className="remark-div">{!!remarks? remarks:"  "}</div>}
                {isEditMode && (
                    <Form onSubmit={this.onSubmit}>
                        <TextArea rows={1}
                                  value={remarks}
                                  onChange={this.onChangeText}
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
    courseId: PropTypes.string.isRequired,
    remarks: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default connect (
    mapStateToProps,
    {updateRemarks}
    ) (WorksheetCourseRemark);
