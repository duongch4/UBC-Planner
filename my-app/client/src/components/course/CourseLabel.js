import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Label } from 'semantic-ui-react'
import {doSearch} from "../../api/CourseSearchApi";

class CourseLabel extends React.Component {

    constructor() {
        super();
    }

    state = {
        courseStatus: '',
    }

    onChange = () => {
        this.setState({courseStatus:this.checkIfTaken()})
    }


    checkIfTaken = () => {
        const {courses} = this.props;
        const {courseId} = this.props;
        const course = courses[courseId];
        if (!course) return '';
        if (!!course.grade) return 'green';
        return 'olive';
    }

    onLabelClick=(e, o)=>{
        console.log(o.children);
        this.props.doSearch(o.children);
    }

    render() {
        const {courseId} = this.props
        return (
            <Label as='a'
                   size={'mini'}
                   color={this.checkIfTaken()}
                   onClick={(e,o)=>{this.onLabelClick(e, o)}} >
                {courseId}
            </Label>
        )
    }
}

const mapStateToProps = state => ({
    courses: state.student.courses
})

CourseLabel.PropTypes = {
    courseId: PropTypes.string.isRequired,
}

export default connect (
    mapStateToProps,
    {doSearch}
) (CourseLabel)