import React from 'react'
import { Progress } from 'semantic-ui-react'
import { connect } from "react-redux"

class WorksheetProgress extends React.Component {

    render () {
        const {courses} = this.props;
        const courseNames = Object.keys(courses);
        const completedNames = courseNames.filter((name)=>courses[name].grade);
        const {requirements} = this.props;
        const progress = Math.round(completedNames.length/requirements.length * 100);
// console.log(completedNames, requirements, courses);
        return (
            <div>
                <Progress percent={progress}
                          indicating
                          // progress
                          size='tiny'/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    requirements: state.bcs.requirements,
    courses: state.student.courses
});

export default connect(
    mapStateToProps
)(WorksheetProgress);