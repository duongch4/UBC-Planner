import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon, Button, Input, Dropdown, Form} from 'semantic-ui-react';

class PlannerInputRow extends React.Component {

    constructor (props) {
        super();
        const freeCourses = props.unassigned || [];
        const gradCreditList =  props.creditFor? Object.keys(props.creditFor) : [];

        this.state = {
            isEditMode: !props.courseId || (props.courseId === ""),
            courseId: props.courseId,
            term: props.term,
            options: [],
            creditOptions: [],
            creditFor: ""
        }

        this.state.options = freeCourses.map(courseId => {
            return {
                key: courseId,
                value: courseId,
                text: courseId
            }
        });

        this.state.creditOptions = gradCreditList.reduce((arr, creditId)=>{
            if (!props.creditFor[creditId]) arr.push({
                key: creditId,
                value: creditId,
                text: creditId})
            return arr;
        }, []);
    }

    componentWillReceiveProps = props => {

        console.log('next props:' , props);

        const { courseId, term } = props;
        const freeCourses = props.unassigned || [];
        const gradCreditList =  props.creditFor? Object.keys(props.creditFor) : [];

        // this.state = {
        //     isEditMode: (props.courseId === ""),
        //     courseId: props.courseId,
        //     term: props.term,
        //     options: [],
        //     creditOptions: [],
        //     creditFor: ""
        // }


        var options = freeCourses.map(courseId => {
            return {
                key: courseId,
                value: courseId,
                text: courseId
            }
        });

        var creditOptions = gradCreditList.reduce((arr, creditId)=>{
            if (!props.creditFor[creditId]) arr.push({
                key: creditId,
                value: creditId,
                text: creditId})
            return arr;
        }, []);

        this.setState({courseId, term, options, creditOptions, isEditMode:false});
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

    render () {
        const { term } = this.props;
        const { options, courseId, isEditMode, creditOptions, creditFor } = this.state;

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
                                      value     = { courseId }
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

PlannerInputRow.PropTypes = {
    term: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    inEditMode: PropTypes.bool.isRequired,
    onEditMode: PropTypes.func.isRequired,
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
)(PlannerInputRow);