// import {PROGRAM_REQUIREMENTS_LOADED} from "../constants/BCSConstnats";
import { ON_AUTOCOMPLETE_SUCCESS, ON_AUTOCOMPLETE_SELECT, ON_QUERY_SUCCESS } from "../constants/CourseSearchConstants";
import { LOG_OUT } from "../constants/LoginConstants";


const initialState = {
  query: '',
  result: [],
  autocomplete: [],
  autocomplete_orig: [],
  history: []
}

const CourseSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_AUTOCOMPLETE_SUCCESS:
      var { result } = action;
      console.log("RESULT", result);
      var autocomplete_orig = result;
      var autocomplete = result.map((course) => {
        return { title: course.key, description: course.title }
      });
      return { ...state, autocomplete, autocomplete_orig };
    case ON_AUTOCOMPLETE_SELECT:
      var { result } = action;
      const { autocomplete_orig, history } = state;
    //  history.push(result);
    //  var result = autocomplete_orig.filter(course => (course.id === id));
      return { ...state, result, history };
    case ON_QUERY_SUCCESS:
      {
        var { result, query } = action;
        var { history } = Object.assign({}, state); //ignore
        history.push(query);
        var autocomplete = [];
        //result already parsed on autocomplete success for department
        // find if has code ie) 1* or 110
        // if 1* -> filter result
        // if 110 -> fetch page and parse
        return { ...state, query, result, history, autocomplete };
      }
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
