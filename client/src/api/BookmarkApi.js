import {addCourseSuccess, removeCourseSuccess} from "../actions/CourseBookmarkAction";
import axios from 'axios';

export const doAddCourse = data => dispatch =>
    axios.post("/api/courses", data, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    // Promise.resolve(course)
    .then(data => dispatch(addCourseSuccess(data)));

export const doRemoveCourse = course => dispatch =>
    // axios.delete("/api/courses", data)
    Promise.resolve(course)
    .then(data => dispatch(removeCourseSuccess(data)));
