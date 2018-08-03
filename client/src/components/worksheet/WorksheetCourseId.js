import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Dropdown, Button, Icon} from "semantic-ui-react"
import {updateCourses, updateRequirementCourse, addCourseBeforeUpdate} from "../../api/WorksheetApi";
import './Worksheet.css'
import {doAddCourse} from "../../api/BookmarkApi";

class WorksheetCourseId extends React.Component {

    constructor(props) {
        super();
        this.state = {
            courseId: props.courseId,
            isEditMode: false,
            requirementId: props.requirementId,
        };
    }

    getOptions = (courses, courseId) => {
        const courseIds = courses? Object.keys(courses) : [];
        return courseIds.reduce((arr, id) => {
            if (courses && (!courses[id].creditFor || courses[id].creditFor===""))
                arr.push({
                    key: id,
                    value: id,
                    text: id
                });
            return arr;
        }, [{ key: courseId, value: courseId, text: courseId }]);
    };

    // componentWillReceiveProps = nextProps => {
    //     const { requirementId } = nextProps;
    //     this.setState({ requirementId });
    // };

    onClick = () => {
        this.props.onClick(this);
        this.setState({isEditMode: true, origId: (this.state.courseId || null)});
    };

    onCancel = () => {
        this.setState({isEditMode: false, courseId: ""});
        this.props.onClick(this);
    };

    onSubmit = () => {
        const { origId, courseId } = this.state;
        const { courses, requirementId, email } = this.props;

        console.log("ON_SUBMIT: courseId", origId, '->', courseId, this.state);

        if ((!origId && !courseId) || (origId == courseId)) {
            this.setState({isEditMode: false});
        } else if (!courseId.trim().length) {
            this.props.updateCourses({
                courseId : null,
                field    : 'creditFor',
                value    : requirementId,
                origId   : origId && origId.trim(),
                email    : email
            }).then(res => this.setState({isEditMode: false}))
        } else if (!courses[courseId]) {
            this.addCourse(this.state.courseId && this.state.courseId.toUpperCase().trim())
                .then(function () {
                    this.props.updateCourses({
                        courseId : courseId && courseId.trim(),
                        field    : 'creditFor',
                        value    : this.props.requirementId,
                        origId   : this.state.origId && this.state.origId.trim(),
                        email    : this.props.email
                    })}.bind(this))
                .then(res => this.setState({isEditMode: false, courseId: courseId}))
                .catch(error => { alert (error); return this.setState({courseId: this.props.courseId}); });
        } else {
            this.props.updateCourses({
                courseId :  this.state.courseId && this.state.courseId.trim(),
                field    : 'creditFor',
                value    : this.props.requirementId,
                origId   : this.state.origId && this.state.origId.trim(),
                email    : this.props.email
            }).then(res => this.setState({isEditMode: false}));
        }
    };

    handleDropdownClose = e => {
        if (this.state.courseId === "" || !this.state.courseId) {
            return;
        }
        this.onSubmit(e);
    }

    addCourse = (value) => {
        switch (value.length) {
            case 0:
                return Promise.resolve();
            case 8:
                break;
            case 7:
                if (value.indexOf("") === -1)
                    value = value.slice(0, 4) + " " +  value.slice(4, 8)
                else return Promise.reject("Invalid course code");
            default: return Promise.reject("Invalid course code");
        }

        value = value.toUpperCase();
        const {courses} = this.props;
        if (courses[value]) {
            return Promise.reject('You are taking course' + (courses[value].year? (courses[value].year + courses[value].term): ""));
        } else
        // TODO validation (check if course exists)
        return this.props.doAddCourse({
                email: this.props.email,
                course: {
                    "id": value && value.toUpperCase(),
                    "isGradApproved": 0,
                    "creditFor": null,
                    "section": null,
                    "credit": null,
                    "grade": null,
                    "year": null,
                    "term": null,
                    "remarks": ""
                }
            });
    };

    handleAddition = (e, { value }) => this.addCourse(value.toUpperCase().trim());

    handleCourseSelect = (e, { value }) => {
        console.log('selected:', value);
        this.state.courseId = value;
        this.setState({courseId:value && value.toUpperCase()});
    };

    render() {
        const {courses} = this.props;
        const {isEditMode, courseId} = this.state;
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
                            options   = { this.getOptions(courses, courseId) }
                            className = { 'courseId' }
                            onAddItem = { this.handleAddition }
                            onChange  = { this.handleCourseSelect }
                            onClose   = { this.handleDropdownClose }
                            value     = { courseId }
                            fluid
                        />
                        <Button circular className={'submit-remarks-button'} size={'mini'} compact>Submit</Button>
                    </Form>
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
    {updateRequirementCourse, doAddCourse, updateCourses}
) (WorksheetCourseId);
