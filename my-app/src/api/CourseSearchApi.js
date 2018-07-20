import _ from 'lodash';
import {courseSearchSuccess, courseAutocompleteSelect, courseAutocompleteSuccess, courseAutocompleteFail, courseSearchFail,
  courseAutocompleteCourseSuccess, loadDepartment, unloadDepartment} from "../actions/CourseSearchActions";
var data  = require("../data/courseSearchList.json");
var async = require('async');
const parseString = require('react-native-xml2js').parseString;

var courseNames = data.depts.dept;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
var date = new Date().getFullYear();
const url = proxyUrl + baseURL + '&sessyr=' + date +'&sesscd=W&req=2&dept=';
const oneCourseUrl = proxyUrl + baseURL + '&sessyr=' + date +'&sesscd=W&req=3&dept=';

export const doAutocompleteDepartment = query => dispatch => new Promise((resolve, reject)=> {

    if (/\s+/.test(query)) {
      query = query.split(/\s+/)[0];
    }

    console.log("doAutocompleteDepartment, query:", query);

    const re = new RegExp("^" + _.escapeRegExp(query.toUpperCase()), 'i')
    const isMatch = courseId => re.test(courseId.$.key + " ")
    const filteredNames = _.filter(courseNames, isMatch)
    console.log("filtered names: ", filteredNames);

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>name.$));
    else
        dispatch(courseAutocompleteFail());
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(courseAutocompleteSuccess(data)));


export const doLoadDepartment = query => (dispatch, getState) => {
  const {loadedDeptName} = getState().courseSearch;
  const {autocomplete_orig} = getState().courseSearch;
  console.log("autocomplete_orig: ", autocomplete_orig)

  if (autocomplete_orig !== undefined && autocomplete_orig !== null && loadedDeptName === "") {
    var courses;
    var name = autocomplete_orig[0].key;
    fetch (url + name + '&output=3', {method: 'GET'})
        .then ((response) => response.text())
        .then ((responseText) => {
            parseString(responseText, (err, result) => {
               courses = result.courses.course;
               });
               return courses;
             })
        .then ((data) => {
          console.log("data: ", data)
          dispatch(loadDepartment(data, name))
        })
        .catch((err) => {
            console.log('Error fetching the feed: ', err)
        })
  }
}

export const doUnloadDepartment = query => (dispatch, getState) => {
  const {loadedDeptName} = getState().courseSearch;
  if (loadedDeptName !== "") dispatch(unloadDepartment());
}

export const doAutocompleteCourse = query => (dispatch, getState) => new Promise((resolve, reject)=> {
  const {loadedDeptName} = getState().courseSearch;
  console.log("query", query)
  if (loadedDeptName === "") dispatch(courseAutocompleteFail())
  else {
    const {loadedDept} = getState().courseSearch;
    if (/\s+/.test(query)) {
      query = query.split(/\s+/)[1];
      console.log("query", query)

      const re = new RegExp("^" + _.escapeRegExp(query.toUpperCase()), 'i')
      const isMatch = course => re.test(course.$.key)
      const filteredCourses = _.filter(loadedDept, isMatch)
      if (filteredCourses && filteredCourses.length) resolve(filteredCourses.map(course=>course.$));
      else {
        dispatch(courseAutocompleteFail());
        reject({
            exists: false,
            error: { message: "Course does not eixsts." }
        });
      }
    }
  }
}, Promise.resolve, Promise.reject)
    .then(data =>
      {
        const {loadedDeptName} = getState().courseSearch;
        dispatch(courseAutocompleteCourseSuccess(data, loadedDeptName))
      });


export const doAutocompleteSelect = query => (dispatch, getState) => {
  const {isCourseCodeLoaded} = getState().courseSearch;
  console.log("query: ", query)

  var fullUrl = "";
  var dept = "";
  if (isCourseCodeLoaded) {
    var key = "";
    if (/\s+/.test(query)) {
      var array = query.split(/\s+/);
      dept = array[0];
      key = array[1];
    }
    fullUrl = oneCourseUrl + dept + '&course=' + key + '&output=3';
    } else {
      const {autocomplete_orig} = getState().courseSearch;
      if (autocomplete_orig !== undefined && autocomplete_orig !== null) {
        dept = autocomplete_orig[0].key;
        fullUrl = url + dept + '&output=3'
      } else {
        dispatch(courseAutocompleteFail());
      }
    }

    var courses = [];
    fetch (fullUrl, {method: 'GET'})
        .then ((response) => response.text())
        .then ((responseText) => {
            parseString(responseText, (err, result) => {
                courses = result.courses.course.map(course => {
                return {
                  "id": dept + ' ' + course.$.key,
                  "name": course.$.title,
                  "description": course.$.descr,
                  "credits": '',
                  "pr": preProcess(course.$.prereqs)
                }
              })
            });
            return courses;
        })
        .then ((data) => {
          console.log("data: ", data)
          dispatch(courseAutocompleteSelect(data))
        })
        .catch((err) => {
            console.log('Error fetching the feed: ', err)
        })

}
/*
  let init = {
     method: 'GET'
  };
  var courses = [];
  fetch (url + dept + '&output=3', init)
      .then ((response) => response.text())
      .then ((responseText) => {
          parseString(responseText, (err, result) => {
            console.log(result)
              courses = result.courses.course.map(course => {
             return {
                "id": dept + ' ' + course.$.key,
                "name": course.$.title,
                "description": course.$.descr,
                "credits": '',
                "pr": preProcess(course.$.prereqs)
              }
            })
          });
          return courses;
      })
      .then(data => {
        console.log("returned course data: ", data)
        dispatch(courseAutocompleteSelect(data))}
      )
      .catch((err) => {
          console.log('Error fetching the feed: ', err)
      })
}*/

export const doSearch = query => (dispatch, getState) => {
  const {isCourseCodeLoaded} = getState().courseSearch;
  console.log("query: ", query)

  var fullUrl = "";
  var dept = "";
  if (isCourseCodeLoaded) {
    var key = "";
    if (/\s+/.test(query)) {
      var array = query.split(/\s+/);
      dept = array[0];
      key = array[1];
    }
    fullUrl = oneCourseUrl + dept + '&course=' + key + '&output=3';
    } else {
      const {autocomplete_orig} = getState().courseSearch;
      if (autocomplete_orig !== undefined && autocomplete_orig !== null) {
        dept = autocomplete_orig[0].key;
        fullUrl = url + dept + '&output=3'
      } else {
        dispatch(courseAutocompleteFail());
      }
    }

    var courses = [];
    fetch (fullUrl, {method: 'GET'})
        .then ((response) => response.text())
        .then ((responseText) => {
            parseString(responseText, (err, result) => {
                courses = result.courses.course.map(course => {
                return {
                  "id": dept + ' ' + course.$.key,
                  "name": course.$.title,
                  "description": course.$.descr,
                  "credits": '',
                  "pr": preProcess(course.$.prereqs)
                }
              })
            });
            return courses;
        })
        .then ((data) => {
          console.log("data: ", data)
          dispatch(courseAutocompleteSelect(data))
        })
        .catch((err) => {
            console.log('Error fetching the feed: ', err)
        })

}



/*

export const doSearch = query => dispatch => new Promise((resolve, reject)=> {

    if (!query | query === '') resolve([]);

    var dept;
    if (/\s+/.test(query)) {
      dept = query.split(/\s+/)[0];
    } else {
      dept = query;
    }

    console.log("doAutocompleteDepartment, dept:", dept, "query: ", query);

    const re = new RegExp("^" + _.escapeRegExp(dept.toUpperCase()), 'i')
    const isDeptMatch = courseId => re.test(courseId.$.key)
    const filteredNames = _.filter(courseNames, isDeptMatch)
    console.log("filtered names: ", filteredNames);

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>name.$.key));
    else
        dispatch(courseSearchFail());
        reject({
        exists: false,
        error: { message: "Department does not exist." }
    });
}, Promise.resolve, Promise.reject)
    .then(depts => {
      var key = "";
      if (/\s+/.test(query)) {
        key = query.split(/\s+/)[1];
      }
      console.log("doAutocompleteDepartment, key:", key, "query: ", query);
      if (key === "") {
        return depts;
      } else {
        console.log("parse by key")
        return depts;
      }
    })
    .then(depts => {
      if (depts && depts.length) {
      let init = {
         method: 'GET'
      };
      var courses = [];
      fetch (url + depts[0] + '&output=3', init)
          .then ((response) => response.text())
          .then ((responseText) => {
              parseString(responseText, (err, result) => {
              /* console.log("parsed result: ", result)
                const isKeyMatch = courseKey => key.test(courseKey.$.key)
                if (key !== "") {
                  result = _.filter(result.courses.course, isKeyMatch)
                }
                courses = result.courses.course.map(course => {
                 return {
                    "id": depts[0] + ' ' + course.$.key,
                    "name": course.$.title,
                    "description": course.$.descr,
                    "credits": '',
                    "pr": preProcess(course.$.prereqs)
                  }
                })
              });
              return courses;
          })
          .then(data => {
            console.log("returned course data: ", data)
            dispatch(courseSearchSuccess(data))}
          )
          .catch((err) => {
              console.log('Error fetching the feed: ', err)
          })
        } else {
          dispatch(courseSearchFail());
        }
    })



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
