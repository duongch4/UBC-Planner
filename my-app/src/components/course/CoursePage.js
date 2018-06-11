import './Course.css';
import React from "react";
import CourseSearch from "./CourseSearch";

class CoursePage extends React.Component {

    render() {
        return (
            <div>
                <CourseSearch/>
            </div>
        );
    }
}

export default CoursePage;