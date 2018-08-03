import _ from 'lodash';
import {courseSearchSuccess, courseAutocompleteSelect, courseAutocompleteDeptSuccess, courseAutocompleteFail, courseSearchFail,
  courseAutocompleteCourseSuccess, loadDepartment, unloadDepartment} from "../actions/CourseSearchActions";
import exemptions from '../data/exemptions';
var data  = require("../data/courseSearchList.json");
var async = require('async');
const parseString = require('react-native-xml2js').parseString;
var courseNames = data.depts.dept;
const proxyUrl = "https://cryptic-headland-94862.herokuapp.com/";//'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
var date = new Date().getFullYear();
const deptUrl = proxyUrl + baseURL + '&sessyr=' + date +'&sesscd=W&req=2&dept=';
const oneCourseUrl = proxyUrl + baseURL + '&sessyr=' + date +'&sesscd=W&req=3&dept=';

export const doCourseSelect = query => (dispatch, getState) => {
    var fullUrl, dept, key = "";
      if (/\s+/.test(query)) {
        dept = query.split(/\s+/)[0];
        key = query.split(/\s+/)[1];
        }
        fullUrl = oneCourseUrl + dept + '&course=' + key + '&output=3';
        getCourses(fullUrl, dept).then((data) => {
          if (data !== undefined) dispatch(courseAutocompleteSelect(data))})
      }

export const doAutocompleteDepartment = query => dispatch => {
    filterDepts(query)
      .then(data => { dispatch(courseAutocompleteDeptSuccess(data)); },
      reject => { dispatch(courseAutocompleteFail()); });
    }

export const doLoadDepartment = query => (dispatch, getState) => {
  const {loadedDeptName} = getState().courseSearch;
  const {autocomplete_orig} = getState().courseSearch;

  if (autocomplete_orig !== undefined && autocomplete_orig !== null && autocomplete_orig[0] !== undefined && loadedDeptName === "") {
    var dept = autocomplete_orig[0].key;
    getParsedDepartment(deptUrl + dept + '&output=3')
        .then((data) => dispatch(loadDepartment(data, dept)))
  }
}

export const doUnloadDepartment = query => (dispatch, getState) => {
  const {loadedDeptName} = getState().courseSearch;
  const {autocomplete_orig} = getState().courseSearch;
  if (loadedDeptName !== "") dispatch(unloadDepartment());
}

export const doAutocompleteCourse = query => (dispatch, getState) => {
  const {loadedDeptName} = getState().courseSearch;
  const {loadedDept} = getState().courseSearch;
  var dept, key, deptName = "";
  if (/\s+/.test(query)) {
    dept = query.split(/\s+/)[0];
    key = query.split(/\s+/)[1];
  }
  var courses = null;
  if (loadedDeptName === "" || loadedDept === [] || loadedDept === undefined) dispatch(courseAutocompleteFail())
  else {
    filterCourses (key, loadedDept)
      .then(data => {
        const {loadedDeptName} = getState().courseSearch;
        dispatch(courseAutocompleteCourseSuccess(data, loadedDeptName));
      },
      reject => { dispatch(courseAutocompleteFail()); });
    }
  }

export const doAutocompleteSelect = query => (dispatch, getState) => {
  var fullUrl, dept, key = "";
  const {isCourseCodeLoaded} = getState().courseSearch;
  if (isCourseCodeLoaded) {
    if (/\s+/.test(query)) {
      // get url for searching by course code
      dept = query.split(/\s+/)[0];
      key = query.split(/\s+/)[1];
      }
      fullUrl = oneCourseUrl + dept + '&course=' + key + '&output=3';
    } else {
      // get url for searching by department
        dept = query.replace(" ", "");
        fullUrl = deptUrl + dept + '&output=3'
    }
    getCourses(fullUrl, dept).then((data) => {
      if (data !== undefined) dispatch(courseAutocompleteSelect(data))})
}

export const doSearch = query => (dispatch, getState) => {
  const {isCourseCodeLoaded} = getState().courseSearch;
  const {loadedDeptName} = getState().courseSearch;
  const {loadedDept} = getState().courseSearch;
  const {autocomplete_orig} = getState().courseSearch;

  if (!query || query === '' || autocomplete_orig === undefined || autocomplete_orig === null || loadedDept === undefined || loadedDept === []) { dispatch(courseSearchFail()) }
  else {
    if (isCourseCodeLoaded) {
      // load courses in autocomplete_orig
      new Promise((resolve, reject)=> {
        var courses = autocomplete_orig.map(course => {
          return {
            "id": loadedDeptName + ' ' + course.key,
            "name": course.title,
            "description": course.descr,
            "prnote": course.prereqnote,
            "pr": preProcess(course.prereqs),
            "conflict": getConflict(loadedDeptName + ' ' + course.key)
          }
        })
        resolve (courses);
      }, Promise.resolve, Promise.reject)
      .then (data => {dispatch(courseSearchSuccess(data))})
    } else {
      // use query to refilter departments and load courses for the first department (not filtered by course key)
      filterDepts(query)
        .then(depts => {
          if (depts[0] === undefined) dispatch(courseSearchFail())
          else {
            var dept = depts[0].key;
            var key = "";
            if (/\s+/.test(query)) {
              key = query.split(/\s+/)[1];
              }
            if (key === "") {
              getCourses(deptUrl + dept + '&output=3', dept).then((data) => {
                if (data !== undefined) dispatch(courseSearchSuccess(data))})
            } else {
              filterAndGetCourses(deptUrl + dept + '&output=3', dept, key).then((data) => {
                if (data !== undefined) dispatch(courseSearchSuccess(data))})
            }
          }
        })
      }
  }
}

const getConflict = id => {
  const re = new RegExp(_.escapeRegExp(id.toUpperCase()), 'i')
  const isMatch = course => re.test(Object.keys(course)[0])
  const filteredCourses = _.filter(exemptions, isMatch)
  var result = [];
  for (var i =0; i < filteredCourses.length; i++) {
    result = result.concat(Object.values(filteredCourses[i])[0]);
  }
  if (result.size == 0) return;
  else return result;
}

/**
 * filters courseNames whose department name matches query and returns array of JSON objects with key, title, faccode, faculty
 * @ param query is the user search input
 */
const filterDepts = query => new Promise((resolve, reject)=> {
    if (/\s+/.test(query)) {
      query = query.split(/\s+/)[0];
    }
    if (!query || query === '') resolve([])
    const re = new RegExp("^" + _.escapeRegExp(query.toUpperCase()), 'i')
    const isMatch = courseId => re.test(courseId.$.key)
    const filteredNames = _.filter(courseNames, isMatch)

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>name.$));
    else
      reject({
        exists: false,
        error: { message: "Department does not exist." }
      });
}, Promise.resolve, Promise.reject)

/**
 * filters courseArray containing given key and returns array of JSON objects with: key, title, descr
 * @ param key is the course key (integer) and courseArray is an array of JSON objects with: key, title, descr
 */
const filterCourses = (key, courseArray) => new Promise((resolve, reject)=> {
    const re = new RegExp("^" + _.escapeRegExp(key.toUpperCase()), 'i')
    const isMatch = course => re.test(course.$.key)
    const filteredCourses = _.filter(courseArray, isMatch)
    if (filteredCourses && filteredCourses.length) resolve(filteredCourses.map(course=>course.$));
    else
      reject({
        exists: false,
        error: { message: "Course does not exist." }
      });
}, Promise.resolve, Promise.reject)

/**
 * parses department url and returns array of JSON objects with: key, title, descr
 * @ param url is the url to be fetched
 */
const getParsedDepartment = (url) => {
return fetch (url, {method: 'GET'})
    .then ((response) => response.text())
    .then ((responseText) => {
      var courses = [];
        parseString(responseText, (err, result) => {
           courses = result.courses.course;
           });
           return courses;
         })
    .catch((err) => {
        console.log('Error fetching the feed: ', err)
    })
}


const filterAndGetCourses = (url, dept, key) => {
  return fetch (url, {method: 'GET'})
      .then ((response) => response.text())
      .then ((responseText) => {
        var courseArray = [];
          parseString(responseText, (err, result) => {
            console.log("courseArray", courseArray)
              courseArray = result.courses.course;
            });
            console.log("courseArray", courseArray)
            return courseArray;
          })
      .then((courseArray) => {
        const re = new RegExp("^" + _.escapeRegExp(key, 'i'))
        const isMatch = course => re.test(course.$.key)
        const filteredCourseArray = _.filter(courseArray, isMatch)
        console.log("filteredCourseArray", filteredCourseArray)
        return (filteredCourseArray);
      })
      .then((filteredCourseArray) => {
        var courses = filteredCourseArray.map(course => {
        return {
          "id": dept + ' ' + course.$.key,
          "name": course.$.title,
          "description": course.$.descr,
          "prnote": course.$.prereqnote,
          "pr": preProcess(course.$.prereqs),
          conflict: getConflict(dept + ' ' + course.$.key)
          }
        })
        console.log("courses", courses)
        return courses;
      })
      .catch((err) => {
          return [];
      })
}

/**
 * returns array of JSON objects with: id, name, description, credits, pr for each course parsed in the url
 * @ param url is the url to be fetched and dept is the department name
 */
const getCourses = (url, dept) => {
  return fetch (url, {method: 'GET'})
      .then ((response) => response.text())
      .then ((responseText) => {
        var courses = [];
          parseString(responseText, (err, result) => {
              courses = result.courses.course.map(course => {
              return {
                "id": dept + ' ' + course.$.key,
                "name": course.$.title,
                "description": course.$.descr,
                "prnote": course.$.prereqnote,
                "pr": preProcess(course.$.prereqs),
                conflict: getConflict(dept + ' ' + course.$.key)
              }
            })
          });
          console.log("result courses: ", JSON.stringify(courses))
          return courses;
      })
      .catch((err) => {
          return [];
      })
}

/**
 * returns if str is "" or NULL
 *  else trim additional comments and pass result to parsePr
 * @ param (string) str is list of prerequisites to be parsed
 */
const preProcess = (str) => {
  if (str === undefined || str === null || str === "") {
    return;
  }
  if (/;/.test(str)) {
    str = str.replace(";", "");
  }
  if (/\./.test(str)) {
    str = str.split(".")[0];
  }
  return parsePr(str);
}

/**
 * if str contains only one prereq returns prereq as a string
 * else returns nested JSON objects with "or" arrays, in which one element is required
 *  and "and" arrays, in which all elements are required
 * else returns if no arrays or courses to be parsed
 * @ param (string) str is list of prerequisites to be parsed
 */
const parsePr = (str) => {
  if (str === null) {
    return;
  }

  // if str contains only one prereq, return prereq
  if (str.length <= 10) {
    var course = /[A-Z]{2,4}\s*\d{2,3}[A-Z]{0,1}/;
    var match = str.match(course);
    if (match != null) {
      return match[0];
    } else {
      return;
    }
  }

  // create "or" array for "and either ... or" condition
  if (/\sand\seither\s\(a\)\s/.test(str)) {
    var orTrim = str.split(/\s*and\seither\s\(a\)\s*/);
    var orSplit = orTrim[1].split(/\s*or\s\([a-z]\)\s*/);
    var orResult = [];
    for (var i = 0; i < orSplit.length; i++) {
      orResult.push(parsePr(orSplit[i]));
    }
    var or = {
      or: orResult
    };
    var andSplit = orTrim[0].split(/\s*and\s*/);
    var andResult = [];
    for (var i = 0; i < andSplit.length; i++) {
      andResult.push(parsePr(andSplit[i]));
    }
    andResult.push(or);
    var and = {
      and: andResult
    };
    return and;
  }

  // create "or" array for "either ... or" condition
  if (/[Ee]ither\s\(a\)\s*/.test(str)) {
    var orTrim = str.split(/[Ee]ither\s\(a\)\s*/)[1];
    var orSplit = orTrim.split(/\s*or\s\([a-z]\)\s*/);
    var orResult = [];
    for (var i = 0; i < orSplit.length; i++) {
      orResult.push(parsePr(orSplit[i]));
    }
    var or = {
      or: orResult
    };
    return or;
  }

  // create "and" array
  if (/\sand\s/.test(str)) {
    var andSplit = str.split(/\s*and\s*/);
    var andResult = [];
    for (var i = 0; i < andSplit.length; i++) {
      andResult.push(parsePr(andSplit[i]));
    }
    var and = {
      and: andResult
    };
    return and;
  }

  // create "one of" array
  if (/[Oo]ne of /.test(str)) {
    var oneOfTrim = str.split(/\s*[Oo]ne of\s*/)[1];
    var oneOfSplit = oneOfTrim.split(", ");
    var oneOf = {
      or: oneOfSplit
    };
    return oneOf;
  }

  // create "all of" array
  if (/[Aa]ll of /.test(str)) {
    var allOfTrim = str.split(/\s*[Aa]ll of\s*/)[1];
    var allOfSplit = allOfTrim.split(", ");
    var allOf = {
      and: allOfSplit
    };
    return allOf;
  }

  // create "two of" array
  if (/[Tt]wo of /.test(str)) {
    var twoOfTrim = str.split(/\s*[Tt]wo of\s*/)[1];
    var twoOfSplit = twoOfTrim.split(", ");
    var twoOf = {
      twoOf: twoOfSplit
    };
    return twoOf;
  }

  if (str.length <= 38 && /[Aa] score of \d{2}% or higher in [A-Z]{3,4}\s*\d{2,3}[A-Z]{0,1}/.test(str)) {
    var course = /[A-Z]{3,4}\s*\d{2,3}[A-Z]{0,1}/;
    var match = str.match(course);
    return match[0];
  }

  return;
}
