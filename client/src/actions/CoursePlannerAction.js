import {STUDENT_ADD_TERM, STUDENT_EDIT_TERM} from '../constants/PlannerConstants'

export const addTerm = term => ({
    type: STUDENT_ADD_TERM,
    term
});

export const editTerm = term => ({
    type: STUDENT_EDIT_TERM,
    term
});