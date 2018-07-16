import React from 'react'
import {connect} from 'react-redux'
import Course from './Course'
import { Grid } from 'semantic-ui-react'


class CourseSearchResults extends React.Component {
    createList = (courses) => {
        return courses.map((course)=>{
            console.log('mapping:', course.id);
            return (
                <Grid.Column mobile={16} tablet={8} computer={8}>
                <Course {...course} course={course}/>
                </Grid.Column>)
        })
    }

    render() {
        const { result } = this.props;

        return (
            <div class="course search">
                <Grid>
                {this.createList(result)}
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    query: state.courseSearch.query,
    result: state.courseSearch.result
});

export default connect (mapStateToProps) (CourseSearchResults);
