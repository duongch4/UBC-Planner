import {
    ON_AUTOCOMPLETE_SELECT, ON_AUTOCOMPLETE_DEPT_SUCCESS, ON_QUERY, ON_QUERY_SUCCESS, ON_QUERY_FAIL, ON_AUTOCOMPLETE_FAIL,ON_AUTOCOMPLETE_COURSE_SUCCESS,
    ON_RESET, ON_LOAD_DEPARTMENT_SUCCESS, ON_UNLOAD_DEPARTMENT_SUCCESS,
} from "../constants/CourseSearchConstants";

export const courseAutocompleteFail = () => ({
    type: ON_AUTOCOMPLETE_FAIL
    });

export const courseAutocompleteDeptSuccess = result => ({
    type: ON_AUTOCOMPLETE_DEPT_SUCCESS,
        result
    });

export const courseAutocompleteCourseSuccess = (result, name) => ({
    type: ON_AUTOCOMPLETE_COURSE_SUCCESS,
        result,
        name
    });

export const courseAutocompleteSelect = result => ({
    type: ON_AUTOCOMPLETE_SELECT,
    result
});

export const loadDepartment = (loadedDept, loadedDeptName) => ({
    type: ON_LOAD_DEPARTMENT_SUCCESS,
        loadedDept,
        loadedDeptName
    });

export const unloadDepartment = () => ({
    type: ON_UNLOAD_DEPARTMENT_SUCCESS
    });

export const courseSearchSuccess = result => ({
    type: ON_QUERY_SUCCESS,
    result
});

export const courseSearchFail = () => ({
    type: ON_QUERY_FAIL,
});

export const reset = () => ({
    type: "",
});
