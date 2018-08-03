import { STUDENT_INIT_COURSE, STUDENT_UPDATE_COURSE, STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE, UPDATE_REMARKS_SUCCESS } from '../constants/WorksheetConstants';
import { LOG_IN, LOG_OUT, UPDATE_INFO_SUCCESS } from '../constants/LoginConstants';
import { ACCOUNT_EDIT, ACCOUNT_CHANGE_PASSWORD, ACCOUNT_DELETE } from '../constants/AccountConstants';

const initialState = {
    isLoggedIn: false,
    info: {},
    courses: {},
    remarks: {},
    token: ''
};

const StudentReducer = (state = initialState, action) => {
    console.log(state);
    switch(action.type) {
        case LOG_IN:
            const { courses, info, remarks, token } = action.student;
            const isLoggedIn = true;
            return { ...state, isLoggedIn, courses, info, remarks, token };
        case LOG_OUT:
            localStorage.removeItem('token');
            return {
                isLoggedIn: false,
                info: {},
                courses: {},
                remarks: {}
            };
        case UPDATE_REMARKS_SUCCESS:
            var newRemarks  = action.remarks;
            var remarks     = state.remarks;
            remarks[newRemarks.id] = newRemarks.content;
            return { ...state, remarks};
        case UPDATE_INFO_SUCCESS:
            const fieldNames = Object.keys(action.student);

            var {info}     = state;

            fieldNames.forEach(name => {
                info[name] = action.student[name];
            });

            return { ...state, info};

        case STUDENT_ADD_COURSE:
            var {course} = action;
            var {courses} = state;
            var newCourses = JSON.parse(JSON.stringify(courses));
            newCourses[course.id] = {
                id: course.id,
                credit: course.credit
            };

            return { ...state, courses:newCourses};
        case STUDENT_REMOVE_COURSE:
            var {courses} = state;
            var {course} = action;
            var newCourses = JSON.parse(JSON.stringify(courses));

            delete newCourses[course.id];
            return { ...state, courses:newCourses};
            
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
