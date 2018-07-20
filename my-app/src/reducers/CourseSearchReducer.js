// import {PROGRAM_REQUIREMENTS_LOADED} from "../constants/BCSConstnats";
import { ON_AUTOCOMPLETE_SUCCESS, ON_AUTOCOMPLETE_SELECT, ON_QUERY_SUCCESS, ON_AUTOCOMPLETE_FAIL, ON_AUTOCOMPLETE_COURSE_SUCCESS, ON_QUERY_FAIL, ON_LOAD_DEPARTMENT_SUCCESS,
  ON_UNLOAD_DEPARTMENT_SUCCESS } from "../constants/CourseSearchConstants";
import { LOG_OUT } from "../constants/LoginConstants";


const initialState = {
  query: '',
  result: [],
  autocomplete: [],
  autocomplete_orig: [],
  history: [],
  loadedDept: [],
  loadedDeptName: "",
  isCourseCodeLoaded: false
}

const CourseSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_AUTOCOMPLETE_FAIL:
      var autocomplete: [];
      var autocomplete_orig: [];
      var isCourseCodeLoaded = false;
        return { ...state, autocomplete, autocomplete_orig, isCourseCodeLoaded };
    case ON_AUTOCOMPLETE_SUCCESS:
      var { result } = action;
      console.log("RESULT", result);
      var autocomplete_orig = result;
      var autocomplete = result.map((course) => {
        return { title: course.key, description: course.title }
      });
      return { ...state, autocomplete, autocomplete_orig };
    case ON_AUTOCOMPLETE_COURSE_SUCCESS:
      var { result } = action;
      var { name } = action;
      var isCourseCodeLoaded = true;
      var autocomplete_orig = result;
      var autocomplete = result.map((course) => {
        return { title: name + " " + course.key, description: course.title }
      });
      return { ...state, autocomplete, isCourseCodeLoaded, autocomplete_orig };
    case ON_AUTOCOMPLETE_SELECT:
      var { result } = action;
      const { autocomplete_orig, history } = state;
    //  history.push(dept);
      return { ...state, result, history };
    case ON_LOAD_DEPARTMENT_SUCCESS:
      var { loadedDept } = action;
      var { loadedDeptName } = action;
      return { ...state, loadedDept, loadedDeptName };
    case ON_UNLOAD_DEPARTMENT_SUCCESS:
      var loadedDeptName = "";
      var loadedDept = [];
      var isCourseCodeLoaded = false;
      return { ...state, loadedDept, loadedDeptName, isCourseCodeLoaded };
    case ON_QUERY_SUCCESS:
      {
        var { result, query } = action;
        var { history } = Object.assign({}, state); //ignore
        history.push(query);
        var autocomplete = [];
        return { ...state, query, result, history, autocomplete };
      }
    case ON_QUERY_FAIL:
      var autocomplete: [];
      var autocomplete_orig: [];
        return { ...state, autocomplete, autocomplete_orig };
    case LOG_OUT:
      return {
        query: '',
        result: [],
        autocomplete: [],
        autocomplete_orig: [],
        history: []
      }
    default:
      return state;
  }
};

export default CourseSearchReducer;
