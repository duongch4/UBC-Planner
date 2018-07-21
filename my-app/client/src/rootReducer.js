import { combineReducers } from "redux";
import StudentReducer from "./reducers/StudentReducer";
import bcsApp from "./reducers/BCSReducer";
import CourseSearchReducer from "./reducers/CourseSearchReducer";

export default combineReducers({
    student: StudentReducer,
    bcs: bcsApp,
    courseSearch: CourseSearchReducer
    // coures: testReducer
});
