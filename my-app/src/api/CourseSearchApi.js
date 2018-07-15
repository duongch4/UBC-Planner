import _ from 'lodash';
import {courseSearchSuccess, courseAutocompleteSuccess} from "../actions/CourseSearchActions";

var data  = require("../data/courses");
var courseNames = Object.keys(data);
//var data  = require("../data/courseSearchList.json");
//var courseNames = data.depts.dept.map(each => each.$.key);

export const doAutocomplete = query => dispatch => new Promise((resolve, reject)=> {

    console.log(query);

    const re = new RegExp(_.escapeRegExp(query.toUpperCase()), 'i')
    const isMatch = courseId => re.test(courseId)
    const filteredNames = _.filter(courseNames, isMatch)
    console.log(filteredNames, data, courseNames);


    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>(data[name])));
    else reject({
        exists: false,
        error: { message: "Course does not eixsts." }
    });
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(courseAutocompleteSuccess(data)));



export const doSearch = query => dispatch => new Promise((resolve, reject)=> {

    if (!query | query === '') resolve([]);
    const re = new RegExp(_.escapeRegExp(query), 'i')
    const isMatch = name => re.test(name)
    const filteredNames = _.filter(courseNames, isMatch)

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>(data[name])));
    else reject({
        exists: false,
        error: { message: "Course does not eixsts." }
    });
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(courseSearchSuccess(data)));
