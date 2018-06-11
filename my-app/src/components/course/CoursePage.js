import './Course.css';
import React from "react";
import CourseSearch from "./CourseSearch";
import CourseSearchResults from "./CourseSearchResults"

class CoursePage extends React.Component {



    render() {
        return (
            <div>
                <CourseSearch/>
                <CourseSearchResults/>
            </div>
        );
    }
}

export default CoursePage;