import AppDispatcher from '../dispatcher/AppDispatcher'
import { ON_QUERY, ON_RESET } from "../constants/CourseSearchConstants";

export default {
    query: (data) => {
        AppDispatcher.dispatch({
            actionType: ON_QUERY,
            data: data
        })
    }
}