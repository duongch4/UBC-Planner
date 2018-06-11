import React from 'react'
import CourseSearchStore from '../../stores/CourseSearchStore'


class CourseSearchResults extends React.Component {

    state = {
        courses: []
    }

    _onSearchResult = () => {
        // console.log(CourseSearchStore.results);
        this.setState({courses:CourseSearchStore.results});
    };

    componentDidMount = () => CourseSearchStore.addChangeListener(this._onSearchResult);

    componentWillUnmount = () => CourseSearchStore.removeChangeListener(this._onSearchResult);

    createList = () => {
        return this.state.courses.map((course)=>{
            return (<div>
                {course.name}
            </div>)
        })
    }

    render() {
        return (
            <div>
                {this.createList()}
            </div>
        );
    }
}

export default CourseSearchResults;