import {STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE} from '../constants/WorksheetConstants'

export const addCourseSuccess = data => ({
    type: STUDENT_ADD_COURSE,
    data
});

export const removeCourseSuccess = data => ({
    type: STUDENT_REMOVE_COURSE,
    data
});