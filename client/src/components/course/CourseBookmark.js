import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { Button, Modal } from 'semantic-ui-react';
import { doAddCourse, doRemoveCourse } from "../../api/BookmarkApi";
// import { doSearch } from '../../api/CourseSearchApi';

class CourseBookmark extends React.Component {

    state = {
        color: this.props.color
    }

    componentWillReceiveProps = nextProps => {
        const { color } = nextProps;
        this.setState({ color });
    };

    onCourseClick = () => {
        const { color } = this.state;
        if (color === 'olive') {
            this.props.doRemoveCourse({
                email: this.props.email,
                course: {
                    "id": this.props.course.id
                }});
        } else if (color === 'grey') {
            this.props.doAddCourse({
                email: this.props.email,
                course: {
                    "id": this.props.course.id,
                    "isGradApproved": 0,
                    "creditFor": null,
                    "section": null,
                    "credit": null,
                    "grade": null,
                    "year": null,
                    "term": null,
                    "remarks": ""
                }
            })
        }
    }

    render() {
        const { color } = this.state;
        const isTaken = (color === 'green');
        const isBookmarked = (color !== 'grey');
        return (<Button basic
                        color={color}
                        icon={isBookmarked? 'bookmark':'bookmark outline'}
                        className={'bookmark outline'}
                        onClick={this.onCourseClick.bind(this)}
                        size={'massive'}/>)
    }
}

const mapStateToProp = state => ({
    courses: state.student.courses,
    email: state.student.info.email
})

CourseBookmark.propTypes = {
    course: PropTypes.object.isRequired,
    color: PropTypes.string.isRequired
}

export default connect (
    mapStateToProp,
    {doAddCourse, doRemoveCourse}
) (CourseBookmark);