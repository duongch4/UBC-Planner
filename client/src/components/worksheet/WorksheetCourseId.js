import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Dropdown, Button, Icon} from "semantic-ui-react"
import {updateRequirementCourse} from "../../api/WorksheetApi";
import './Worksheet.css'
import {doAddCourse} from "../../api/BookmarkApi";

class WorksheetCourseId extends React.Component {

    state = {
        courseId: this.props.courseId,
        isEditMode: false,
        requirementId: this.props.requirementId
    };

    getOptions = () => {
        const { courses } = this.props;
        const { courseId } = this.state;
        const courseIds = courses? Object.keys(courses) : [];

        console.log("getOptions", courseId, courseIds.reduce((arr, id) => {
            if (courses && !courses[id].creditFor)
                arr.push({
                    key: id,
                    value: id,
                    text: id
                });

            return arr;
        }, [{ key: courseId, value: courseId, text: courseId }]))

        return courseIds.reduce((arr, id) => {
            if (courses && !courses[id].creditFor)
                arr.push({
                    key: id,
                    value: id,
                    text: id
                });

            return arr;
        }, [{ key: courseId, value: courseId, text: courseId }]);
    }

    componentWillReceiveProps = nextProps => {
        const { isEditMode, courseId, requirementId } = nextProps;
        this.setState({ isEditMode, courseId, requirementId });
    };

    onClick = () => {
        this.props.onClick(this);
        this.setState({isEditMode: true});
    }

    onCancel = e => {
        this.setState({isEditMode: false, courseId: ""});
        this.props.onClick(this);
    }

    onSubmit = e => {
        this.setState({isEditMode: false});
        // TODO data submit
        // if (!!this.state.courseId)

        console.log("courseId", this.state.courseId);
        this.props.updateRequirementCourse({
            id: this.state.courseId,
            field: 'creditFor',
            value: this.props.requirementId,
            origId: this.props.courseId,
            email: this.props.email
        })
    }

    handleDropdownClose = e => {
        if (this.state.courseId === "" || !this.state.courseId) {
            return;
        }

        this.onSubmit(e);
    }

    handleAddition = (e, { value }) => {
        switch (value.length) {
            case 8:
                break;
            case 7:
                if (value.indexOf("") === -1) value = value.slice(0, 4) + " " +  value.slice(4, 8)
                else return;
            default: return;
        }

        value = value.toUpperCase();
        const {courses} = this.props;
        if (courses[value]) {
            alert('You are taking course in ' + courses[value].year + courses[value].term);
            // TODO yes, no
        } else
        // TODO validation (check if course exists)
        // TODO API bookmark
            this.props.doAddCourse(value);
    }

    handleCourseSelect = (e, { value }) => {
        console.log('select', value);
        this.setState({courseId:value});
        // this.props.onSubmit({original: this.props.courseId, changed:value});
        // TODO API
    }

    render() {

        const {isEditMode, courseId, options} = this.state;
        console.log('RENDERING: ', courseId);
        return (
            <div onClick={this.onClick}>
                {!isEditMode && <div class="remark-div">{!!courseId? courseId:"  "}</div>}
                {isEditMode && (
                    <div>
                    <Form onSubmit={this.onSubmit}>
                        <Dropdown
                            placeholder='Select a course'
                            search
                            allowAdditions
                            selection
                            autofocus
                            options   = { this.getOptions() }
                            className = { 'courseId' }
                            onAddItem = { this.handleAddition }
                            onChange  = { this.handleCourseSelect }
                            onClose   = { this.handleDropdownClose }
                            value     = { courseId }
                            fluid
                        />
                        <Button circular className={'submit-remarks-button'} size={'mini'} compact>Submit</Button>
                    </Form>
                    {/*<Button circular className={'submit-remarks-button'} size={'mini'} compact onClick={this.onCancel}>Delete</Button>*/}
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    email: state.student.info.email,
    courses: state.student.courses,
    unassigned: state.student.planner[null],
    creditFor: state.student.creditFor
});

WorksheetCourseId.propTypes = {
    requirementId: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default connect (
    mapStateToProps,
    {updateRequirementCourse, doAddCourse}
) (WorksheetCourseId);
