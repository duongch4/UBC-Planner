import {addCourseSuccess, removeCourseSuccess} from "../actions/CourseBookmarkAction";
import axios from 'axios';

export const doAddCourse = data => dispatch =>
    axios.post("/api/courses_add", data, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
    .then(resp => dispatch(addCourseSuccess(data)));

export const doRemoveCourse = data => dispatch =>
    axios.post("/api/courses_delete", data, { headers: {'Authorization': "bearer " + localStorage.getItem('token')}})
        .then(resp => dispatch(removeCourseSuccess(data)))
        .catch(err => console.error(err));