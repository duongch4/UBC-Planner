import React from 'react'
import CourseSearchStore from '../../stores/CourseSearchStore'
import Course from './Course'
import { Grid } from 'semantic-ui-react'


class CourseSearchResults extends React.Component {
    state = {
        courses: []
    }

    _onSearchResult = () => {
        this.setState({courses:[]});
        console.log("onSearchResult", CourseSearchStore.results);

        if (!CourseSearchStore.results || !CourseSearchStore.results.length || !CourseSearchStore.results[0]) return;

        setTimeout(() => {
            this.setState({courses:CourseSearchStore.results});
        }, 0)
    };
    componentDidMount = () => CourseSearchStore.addChangeListener(this._onSearchResult);
    componentWillUnmount = () => CourseSearchStore.removeChangeListener(this._onSearchResult);

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
        const { courses } = this.state;
        return (
            <div class="course search">
                <Grid>
                {this.createList(courses)}
                </Grid>
            </div>
        );
    }
}

export default CourseSearchResults;