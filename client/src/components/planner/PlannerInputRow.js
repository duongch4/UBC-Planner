import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon, Button, Input, Dropdown, Form} from 'semantic-ui-react';
import {doUpdatePlannerCourse} from "../../api/PlannerApi";
import {doAddCourse} from "../../api/BookmarkApi";

class PlannerInputRow extends React.Component {

    constructor(props) {
        super();

        const {courses, courseId, creditFor} = props;
        const course = courses[courseId];

        this.state = {
            isEditMode: !courseId || (courseId === ""),
            courseId: courseId,
            term: props.term,
            year: props.year,
            // courseOptions: [],
            // creditOptions: [],
            creditFor: (course && course.creditFor) || "",
            section: (course && course.section) || "",
            grade: (course && course.grade) || "",
        }
        //
        // this.state.courseOptions = this.generateCourseOptions(freeCourses, courseId)
        //
        // this.state.creditOptions = this.generateRequirementOptions(courseId, creditFor);
    }

    componentWillReceiveProps = props => {
        const {courseId, term, courses, year} = props;

        // let creditOptions = this.generateRequirementOptions(props.courseId, props.creditFor);
        // let courseOptions = this.generateCourseOptions(freeCourses, courseId);

        const course = courses[courseId];
        this.setState({
            courseId, term, year,
            // creditOptions, courseOptions,
            creditFor: (course && course.creditFor) || "",
            section: (course && course.section) || "",
            grade: (course && course.grade) || "",
            isEditMode: false
        });
    };

    generateCourseOptions = (freeCourses, courseId) => {
        return freeCourses && freeCourses.reduce && freeCourses.reduce((arr, id) => {
            arr.push({
                key: id,
                value: id,
                text: id
            })
            return arr;
        }, [{
            key: null,
            value: null,
            text: " "
        }, {
            key: courseId,
            value: courseId,
            text: courseId
        }]);
    };

    generateRequirementOptions = (courseId) => {
        const {creditFor} = this.props;
        const gradCreditList = creditFor ? Object.keys(creditFor) : [];

        return gradCreditList.reduce((arr, creditId) => {
            // console.log("CREATE_LIST", creditFor[creditId], courseId, (creditFor[creditId] === courseId));
            if (!creditFor[creditId] || creditFor[creditId] === courseId) arr.push({
                key: creditId,
                value: creditId,
                text: creditId
            })
            return arr;
        }, [{
            key: null,
            value: null,
            text: " "
        }, {key: this.state.creditFor, value: this.state.creditFor, text: this.state.creditFor || ""}]);

    }

    addCourse = (value) => {
        switch (value.length) {
            case 0:
                return Promise.reject("Invalid course code");
            case 8:
                break;
            case 7:
                if (value.indexOf("") === -1)
                    value = value.slice(0, 4) + " " + value.slice(4, 8)
                else return Promise.reject("Invalid course code");
            default:
                return Promise.reject("Invalid course code");
        }

        value = value.toUpperCase();
        const {courses} = this.props;
        if (courses[value]) {
            return Promise.reject('You are taking course ' + (courses[value].year ? ("in " + courses[value].year + courses[value].term) : ""));
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

    handleAddition = (e, {value}) =>
        this.addCourse(value.toUpperCase().trim()).catch(err => {
            alert(err);
        });

    handleCourseChange = (e, {value, className}) => {
        let courseId = value;
        const {courses, creditFor} = this.props;
        const course = courses[courseId]

        console.log("handleCourseChange", className, courseId, creditFor, this.state);
        // TODO: API
        this.setState({
            ...this.state,
            [className]: courseId,
            section: (course && course.section) || "",
            grade: (course && course.grade) || "",
            creditFor: courses[courseId] && courses[courseId].creditFor,
            creditOptions: this.generateRequirementOptions(courseId, creditFor)
        });
    }

    onFieldTextChange = (e, {value, className}) => {

        console.log(arguments);
        this.setState({...this.state, [ className ]: value});
    }

    handleBCSChange = (e, {value, className}) => {
        const {creditOptions} = this.state;
        // TODO: API
        this.setState({...this.state, [className]: value});
    }

    trySubmit = () => {
        if (!this.state.courseId && !this.props.courseId) return Promise.resolve();

        return this.props.doUpdatePlannerCourse({
            email: this.props.email,
            courseId: this.state.courseId && this.state.courseId.trim(),
            origId: this.props.courseId, // original id
            course: {
                creditFor: this.state.creditFor,
                grade: this.state.grade,
                section: this.state.section,
                year: this.state.year,
                term: this.state.term
            }
        });
    };

    onSubmit = () => {
        this.trySubmit()
            .then(res => {
                this.setState({isEditMode: false})
                this.props.onSubmit(this);
            })
    }

    onClick = () => {
        this.setState({isEditMode: this.props.onEditMode(this)});
    }

    onRemoveCourse = () => {
        this.state.courseId = null;
        this.onSubmit();
    };

    render() {
        const {term} = this.props;
        const {courseOptions, courseId, isEditMode, creditOptions, creditFor, section, grade} = this.state;

        const freeCourses = this.props.unassigned || [];
        // console.log('RENDER: ', courseId, creditFor, creditOptions);

        if (isEditMode) {
            return (<Table.Row className='inputField'>
                <Table.Cell><Dropdown
                    placeholder='CPSC ...'
                    search
                    allowAdditions
                    autoFocus
                    selection
                    options={this.generateCourseOptions(freeCourses, this.props.courseId)}
                    className={'courseId'}
                    onAddItem={this.handleAddition}
                    onChange={this.handleCourseChange}
                    value={courseId}
                /></Table.Cell>
                <Table.Cell><Input type='text'
                                   transparent
                                   placeholder={'Section'}
                                   className={'section'}
                                   onChange={this.onFieldTextChange}
                                   value={section}/></Table.Cell>
                <Table.Cell><Dropdown placeholder='CPSC ...'
                                      search
                                      options={this.generateRequirementOptions(courseId)}
                                      className={'creditFor'}
                                      onChange={this.handleBCSChange}
                                      value={creditFor}
                /></Table.Cell>
                <Table.Cell><Input type='text'
                                   transparent
                                   placeholder={'Grade'}
                                   className={'grade'}
                                   value={grade}
                                   onChange={this.onFieldTextChange}/></Table.Cell>
                <Table.Cell><Icon name='save' onClick={this.onSubmit}/>
                    <Icon name='delete' onClick={this.onRemoveCourse}/>
                </Table.Cell>
            </Table.Row>)
        }
        return (
            <Table.Row onClick={this.onClick}>
                <Table.Cell>{courseId}</Table.Cell>
                <Table.Cell>{section || ""}</Table.Cell>
                <Table.Cell>{creditFor}</Table.Cell>
                <Table.Cell>{grade}</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
        )
    };
}

PlannerInputRow.PropTypes = {
    term: PropTypes.number.isRequired,
    year: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    inEditMode: PropTypes.bool.isRequired,
    onEditMode: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    email: state.student.info.email,
    courses: state.student.courses,
    unassigned: state.student.planner[null],
    creditFor: state.student.creditFor
});

export default connect (
    mapStateToProps,
    {doUpdatePlannerCourse, doAddCourse}
)(PlannerInputRow);