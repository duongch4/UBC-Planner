import './Course.css';
import React from "react";
import CourseSearch from "./CourseSearch";
import CourseSearchResults from "./CourseSearchResults"
import {Segment} from 'semantic-ui-react'

class CoursePage extends React.Component {
    render() {
        return (
            <div class="course-page">
                <CourseSearch/>
                <CourseSearchResults/>
            </div>
        );
    }
}

export default CoursePage;