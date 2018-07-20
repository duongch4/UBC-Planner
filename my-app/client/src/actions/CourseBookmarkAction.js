import {STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE} from '../constants/WorksheetConstants'

export const addCourseSuccess = course => ({
    type: STUDENT_ADD_COURSE,
    course
});

export const removeCourseSuccess = course => ({
    type: STUDENT_REMOVE_COURSE,
    course
});