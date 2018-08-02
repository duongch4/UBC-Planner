import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon, Button, Input, Dropdown, Form} from 'semantic-ui-react';

class CourseDropdown extends React.Component {

    constructor (props) {
        super();
        const freeCourses = props.unassigned? Object.keys(props.unassigned) : [];

        this.state = {
            courseId: props.courseId,
            options: [],
            isOpen: false
        }

        this.state.options = freeCourses.map(courseId => {
            return {
                key: courseId,
                value: courseId,
                text: courseId
            }
        });
    }

    componentWillReceiveProps = props => {

        console.log('next props:' , props);

        const { courseId } = props;
        const freeCourses = props.unassigned? Object.keys(props.unassigned) : [];

        var options = freeCourses.map(courseId => {
            return {
                key: courseId,
                value: courseId,
                text: courseId
            }
        });

        this.setState({courseId, options});
    };

    handleAddition = (e, { value }) => {
        value = value.toUpperCase();
        const {courses} = this.props;
        if (courses[value]) {
            alert('You are taking course in ' + courses[value].year + courses[value].term);
            // TODO yes, no
        } else
        // TODO validation (check if course exists)
        // TODO API bookmark
            this.setState({
                options: [{ text: value, value }, ...this.state.options],
                isOpen: true
            })
    }

    handleCourseChange = (e, { value, className }) => {
        let { creditOptions, creditFor } = this.state;
        if (creditOptions.find(function(el) { return el.key === value})) {
            creditFor = value;
        }

        console.log(value, creditFor);
        // TODO: API
        this.setState({...this.state, [className]: value, creditFor});
    }

    handleBCSChange = (e, { value, className }) => {
        const { creditOptions } = this.state;
        // TODO: API
        this.setState({...this.state, [className]: value});
    }

    handleBlur = () => {
        this.setState({isOpen: false})
        this.props.onSubmit(this);
    }

    render () {
        const { options, courseId, isOpen } = this.state;

        if (isEditMode) {
            return (<Table.Row >
                <Table.Cell><Dropdown
                    placeholder='CPSC ...'
                    fluid
                    search
                    allowAdditions
                    autofocus
                    options   = { options }
                    className = { 'courseId' }
                    onAddItem = { this.handleAddition }
                    onChange  = { this.handleCourseChange }
                    onBlur    = { this.handleBlur }
                    onClick   = { this.handleClick }
                    value     = { courseId }
                    open      = { isOpen }
                /></Table.Cell>
                <Table.Cell><Input type = 'text'
                                   fluid
                                   transparent
                                   placeholder={'Section'}
                                   className={'section'}
                                   onChange = {this.handleChange}/></Table.Cell>
                <Table.Cell><Dropdown placeholder='CPSC ...'
                                      fluid
                                      search
                                      options   = { creditOptions }
                                      className = { 'creditFor' }
                                      onChange  = { this.handleBCSChange }
                                      value     = { creditFor }
                /></Table.Cell>
                <Table.Cell><Input type = 'text'
                                   fluid
                                   transparent
                                   placeholder={ 'grade' }
                                   className={ 'Grade' }
                                   onChange = { this.handleChange }/></Table.Cell>
                <Table.Cell><Icon name='save' /></Table.Cell>
            </Table.Row>)
        }


        const { courses } = this.props;

        const course = courses[courseId];

        console.log(courses, course, courseId);

        return (
            <Table.Row>
                <Table.Cell>{ courseId }</Table.Cell>
                <Table.Cell>{ course.section || "" }</Table.Cell>
                <Table.Cell>{ course.creditFor }</Table.Cell>
                <Table.Cell>{ course.grade }</Table.Cell>
                <Table.Cell><Icon name='delete'/></Table.Cell>
            </Table.Row>
        )};
}

CourseDropdown.PropTypes = {
    onSubmit: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    courses: state.student.courses,
    unassigned: state.student.planner[null],
    creditFor: state.student.creditFor
});

export default connect (
    mapStateToProps,
    null
)(CourseDropdown);