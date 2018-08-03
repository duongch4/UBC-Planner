import {
    STUDENT_INIT_COURSE, STUDENT_UPDATE_COURSE, STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE, UPDATE_REMARKS_SUCCESS,
    UPDATE_COURSE_REQUIREMENT_SUCCESS
} from '../constants/WorksheetConstants';
import { STUDENT_ADD_TERM, STUDENT_EDIT_TERM } from '../constants/PlannerConstants';
import { LOG_IN, LOG_OUT, UPDATE_INFO_SUCCESS } from '../constants/LoginConstants';
import update from 'react-addons-update';
import bcs from '../data/bcs.json';

const initialState = {
    isLoggedIn: false,
    info: {},
    courses: {},
    remarks: {},
    planner: {},
    creditFor: {},
    token: ''
};

const StudentReducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type) {
        case LOG_IN:
            const { courses, info, remarks, token } = action.student;
            const isLoggedIn = true;
            let creditFor = {
                "PADE": null,
                "ENGL 1XX": null,
                "CPSC 110": null,
                "CPSC 121": null,
                "MATH 180": null,
                "STAT 203": null,
                "Communication": null,
                "CPSC 210": null,
                "CPSC 221": null,
                "CPSC 213": null,
                "CPSC 310": null,
                "CPSC 320": null,
                "CPSC 313": null,
                "CPSC 3X1": null,
                "CPSC 3X2": null,
                "CPSC 4X1": null,
                "CPSC 4X2": null,
                "BM1": null,
                "BM2": null,
                "BM3": null,
                "BM4": null
            };
            let planner = {};
            let courseKeys = courses? Object.keys(courses) : [];
            courseKeys.forEach(function (courseCode) {
                let { year } = courses[courseCode];
                let { term } = courses[courseCode];
                let yearTerm = (year && term && year+term) || null;
                planner[yearTerm] = planner[yearTerm]? planner[yearTerm] : [];
                planner[yearTerm].push(courseCode);
                creditFor[courses[courseCode].creditFor] = courseCode;
            }, planner);
            return { ...state, isLoggedIn, courses, info, remarks, token, planner, creditFor };
        case LOG_OUT:
            localStorage.removeItem('token');
            return {
                isLoggedIn: false,
                info: {},
                courses: {},
                remarks: {},
                planner: {},
                creditFor: {
                    "PADE": null,
                    "ENGL 1XX": null,
                    "CPSC 110": null,
                    "CPSC 121": null,
                    "MATH 180": null,
                    "STAT 203": null,
                    "ENGL 3XX": null,
                    "CPSC 210": null,
                    "CPSC 221": null,
                    "CPSC 213": null,
                    "CPSC 310": null,
                    "CPSC 320": null,
                    "CPSC 313": null,
                    "CPSC 3X1": null,
                    "CPSC 3X2": null,
                    "CPSC 4X1": null,
                    "CPSC 4X2": null,
                    "BM1": null,
                    "BM2": null,
                    "BM3": null,
                    "BM4": null
                }
            };
        case UPDATE_REMARKS_SUCCESS:
            var newRemarks  = action.remarks;
            var remarks     =  state.remarks;
            remarks[newRemarks.id] = newRemarks.content;
            return { ...state, remarks};
        case UPDATE_INFO_SUCCESS:
            const fieldNames = Object.keys(action.student);

            var { info }     = state;

            fieldNames.forEach(name => {
                info[name] = action.student[name];
            });

            console.log(action, action.student);
            return { ...state, info};

        case STUDENT_ADD_COURSE:
            var { course  } = action.data;
            var { courses } = state;
            var newCourses = (courses && JSON.parse(JSON.stringify(courses))) || {};
            newCourses[course.id] = JSON.parse(JSON.stringify(course));

            var planner = {};
            var courseKeys = (courses && Object.keys(courses)) || [];
            courseKeys.forEach(function (courseCode) {
                var { year } = courses[courseCode];
                var { term } = courses[courseCode];
                var yearTerm = (year && term && year+term) || null;
                planner[yearTerm] = planner[yearTerm]? planner[yearTerm] : {};
                planner[yearTerm][courseCode] = courses[courseCode];
            }, planner);

            return { ...state, courses:newCourses};
        case STUDENT_REMOVE_COURSE:
            var { course }  = action.data;
            var { courses } = state;
            var newCourses  = JSON.parse(JSON.stringify(courses));

            delete newCourses[course.id];
            return { ...state, courses:newCourses};
        case STUDENT_ADD_TERM:
            var { planner } = state;
            var { term } = action;
            var newPlanner = ( planner && JSON.parse(JSON.stringify(planner)) ) || {};
            newPlanner[term] = [];
            return { ...state, planner:newPlanner};
        case UPDATE_COURSE_REQUIREMENT_SUCCESS:
            console.log('ACTION', action);

            var { id, field, value, origId } = action;
            var { courses, creditFor } = state;

            var newCourses;
            var course;

            if (origId && origId.length !== 0) {
                course = courses[origId];
                course[origId][field] = null;
                // newCourses = update(courses, {[origId]: {[field]: {$set: null}}});
            } else {
                newCourses = courses;
            }

            console.log(courses);
            console.log(newCourses);

            course = courses[id];
            if (!!course) {
                course[field] = value;
                // newCourses = update(newCourses, {[id]: {[field]: {$set: value}}});
            }

            var newCreditFor;
            if (field === 'creditFor') {

                creditFor[value] = id;
                // newCreditFor = update(creditFor, {[value]: {$set: id}});
            } else {
                newCreditFor = creditFor;
            }

            return { ...state, courses, creditFor };
        case STUDENT_EDIT_TERM:
            var { planner, courses } = state;
            var { origTerm, newTerm } = action.term;
            var year = newTerm.substring(0, 5);
            var semester = parseInt(newTerm.charAt(5));
            var newPlanner = ( planner && JSON.parse(JSON.stringify(planner)) ) || {};
            var courseCodes = ( newPlanner && newPlanner[origTerm] && Object.keys(newPlanner[origTerm])) || [];

            courseCodes.forEach(courseCode => {
                var course = newPlanner[origTerm][courseCode];
                course.year = year;
                course.term = semester;

                courses[courseCode] = course;
            });

            newPlanner[newTerm] = newPlanner[origTerm];
            delete newPlanner[origTerm];

            return { ...state, planner:newPlanner, courses};
        default: return state;
    }
};

export default StudentReducer;
