import React from 'react'
import {connect} from 'react-redux'
import Course from './Course'
import { Grid } from 'semantic-ui-react'


class CourseSearchResults extends React.Component {

    renderList = (courses) => courses.map((course)=>(
        <Grid.Column key={course.id} mobile={16} tablet={8} computer={8}>
            <Course {...course} course={course}/>
        </Grid.Column>));

    render() {
        const { result } = this.props;
        return (
            <div className="course search">
                <Grid>
                {this.renderList(result)}
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