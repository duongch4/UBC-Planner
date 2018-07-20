import {addCourseSuccess, removeCourseSuccess} from "../actions/CourseBookmarkAction";

export const doAddCourse = course => dispatch => Promise.resolve(course)
    .then(data => dispatch(addCourseSuccess(data)));

export const doRemoveCourse = course => dispatch => Promise.resolve(course)
    .then(data => dispatch(removeCourseSuccess(data)));
