import {
    STUDENT_INIT_COURSE, STUDENT_UPDATE_COURSE, STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE, UPDATE_REMARKS_SUCCESS,
    UPDATE_COURSE_REQUIREMENT_SUCCESS
} from '../constants/WorksheetConstants';
import {STUDENT_ADD_TERM, STUDENT_EDIT_TERM, UPDATE_COURSE_PLANNER_SUCCESS} from '../constants/PlannerConstants';
import { LOG_IN, LOG_OUT, UPDATE_INFO_SUCCESS } from '../constants/LoginConstants';
import update from 'react-addons-update';
import bcs from '../data/bcs.json';
import {ACCOUNT_CHANGE_PASSWORD, ACCOUNT_DELETE, ACCOUNT_EDIT} from "../constants/AccountConstants";

const initialState = {
    isLoggedIn: false,
    info: {},
    courses: {},
    remarks: {},
    planner: {},
    creditFor: {}
};

const StudentReducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type) {
        case LOG_IN:
            const { courses, info, remarks } = action.student;
            const isLoggedIn = true;
            let creditFor = {
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
            return { ...state, isLoggedIn, courses, info, remarks, planner, creditFor };
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
            newCourses[course.id] = course;

            var planner = Object.keys(state.planner).reduce((obj, key) => {
                obj[key] = [];
                return obj;
            }, {});

            var courseKeys = (newCourses && Object.keys(newCourses)) || [];
            courseKeys.forEach(function (courseCode) {
                var { year } = newCourses[courseCode];
                var { term } = newCourses[courseCode];
                var yearTerm = (year && term && year+term) || null;
                planner[yearTerm] = planner[yearTerm]? planner[yearTerm] : [];
                planner[yearTerm].push(courseCode);
            }, planner);
            return { ...state, courses:newCourses, planner};
        case STUDENT_REMOVE_COURSE:
            var { courses, planner, creditFor } = state;
            var { id }  = action.data.course;
            var course = courses[id];
            var newCourses  = JSON.parse(JSON.stringify(courses));
            var newPlannerForTerm;
            var origPlannerForTerm = planner[course.year + course.term];
            if (origPlannerForTerm) {
                newPlannerForTerm = origPlannerForTerm.filter(courseCode => (courseCode != id)) ;
                planner[course.year + course.term] = newPlannerForTerm;
            }

            var requirementId = course.creditFor;
            if (requirementId) {
                creditFor[requirementId] = null
            }

            delete newCourses[id];

            return { ...state, courses:newCourses, planner, creditFor};
        case STUDENT_ADD_TERM:
            var { planner } = state;
            var { term } = action;
            var newPlanner = ( planner && JSON.parse(JSON.stringify(planner)) ) || {};
            newPlanner[term] = [];
            return { ...state, planner:newPlanner};
        case UPDATE_COURSE_REQUIREMENT_SUCCESS:

            var { courseId, field, value, origId } = action;
            var { courses, creditFor } = state;

            var newCourses;
            var course;

            course = courses[origId];
            if (course) {
                courses[origId][field] = null;
                // newCourses = update(courses, {[origId]: {[field]: {$set: null}}});
            } else {
                newCourses = courses;
            }

            course = courses[courseId];
            if (!!course) {
                course[field] = value;
            }
            if (field === 'creditFor') {
                creditFor = update(creditFor, {[value]: {$set: courseId}});
            }
            return { ...state, courses, creditFor };
        case STUDENT_EDIT_TERM:
            const {origTerm} = action.query;
            delete state.planner[origTerm];
            // var { planner, courses } = state;
            // var { origTerm, newTerm } = action.term;
            // var year = newTerm.substring(0, 5);
            // var semester = parseInt(newTerm.charAt(5));
            // var newPlanner = ( planner && JSON.parse(JSON.stringify(planner)) ) || {};
            //
            // var courseCodes = (planner && planner[origTerm]) || [];
            // console.log("ACTION", courseCodes, action);
            //
            // newPlanner[newTerm] = courseCodes.reduce((arr, courseCode) => {
            //     var course = courses[courseCode];
            //     course.year = year;
            //     course.term = semester;
            //     courses[courseCode] = course;
            //     arr.push(courseCode);
            //     return arr;
            // }, []);
            // delete newPlanner[origTerm];
            //
            // return { ...state, planner:newPlanner, courses};
        case UPDATE_COURSE_PLANNER_SUCCESS:
            var { courses } = action.data;

            var planner = Object.keys(state.planner).reduce((obj, key) => {
                obj[key] = [];
                return obj;
            }, {});
            var courseKeys = courses? Object.keys(courses) : [];
            var creditFor = {
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
            };

            courseKeys.forEach(function (courseCode) {
                let { year } = courses[courseCode];
                let { term } = courses[courseCode];
                let yearTerm = (year && term && year+term) || null;
                planner[yearTerm] = (planner[yearTerm])? planner[yearTerm] : [];

                console.log("yearTerm", yearTerm, planner[yearTerm]);
                planner[yearTerm].push(courseCode);
                creditFor[courses[courseCode].creditFor] = courseCode;
            });

            return { ...state, courses, planner, creditFor};
            case ACCOUNT_EDIT:
                var {info}     = state;
                var newinfo = {
    				bm: action.student.data.bm,
    				cohort: action.student.data.cohort,
    				email: action.student.data.email,
    				name: action.student.data.name,
    				password: info['password'],
    				sid: action.student.data.sid
    			}
                return { ...state, info: newinfo};

            case ACCOUNT_CHANGE_PASSWORD:
            console.log(action);
    			var {info} = state;
    			var newinfo = {
    				bm: info['bm'],
    				cohort: info['cohort'],
    				email: info['email'],
    				name: info['name'],
    				password: action.student.newpassword,
    				sid: info['sid']
    			}
    			return { ...state, info: newinfo};

            case ACCOUNT_DELETE:
    			return { ...state}
        default: return state;
    }
};

export default StudentReducer;