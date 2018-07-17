import _ from 'lodash';
import {courseSearchSuccess, courseAutocompleteSelect, courseAutocompleteSuccess, courseAutocompleteFail} from "../actions/CourseSearchActions";
var data  = require("../data/courseSearchList.json");
const parseString = require('react-native-xml2js').parseString;

var courseNames = data.depts.dept;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
var date = new Date().getFullYear();
const url = proxyUrl + baseURL + '&sessyr=' + date +'&sesscd=W&req=2&dept=';

export const doAutocomplete = query => dispatch => new Promise((resolve, reject)=> {

    console.log("doAutocomplete, query:", query);

    const re = new RegExp(_.escapeRegExp(query.toUpperCase()), 'i')
    const isMatch = courseId => re.test(courseId.$.key)
    const filteredNames = _.filter(courseNames, isMatch)
    console.log("filtered names: ", filteredNames); // filtered dept names

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>name.$));
    else
        dispatch(courseAutocompleteFail());
        reject({
        exists: false,
        error: { message: "Course does not exist." }
    });
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(courseAutocompleteSuccess(data)));


export const doAutocompleteSelect = dept => dispatch => {
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
              if (!course.$.hasOwnProperty("prereqs")) {
                return {
                   "id": dept + ' ' + course.$.key,
                   "name": course.$.title,
                   "description": course.$.descr,
                   "credits": '',
                 }
              } else {
             return {
                "id": dept + ' ' + course.$.key,
                "name": course.$.title,
                "description": course.$.descr,
                "credits": '',
                "pr": preProcess(course.$.prereqs)
              }
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
}

export const doSearch = query => dispatch => new Promise((resolve, reject)=> {

    if (!query | query === '') resolve([]);
    const re = new RegExp(_.escapeRegExp(query), 'i')
    const isMatch = courseId => re.test(courseId.$.key)
    const filteredNames = _.filter(courseNames, isMatch)

    if (filteredNames && filteredNames.length) resolve(filteredNames.map(name=>name.$));
    else reject({
        exists: false,
        error: { message: "Course does not exist." }
    });
}, Promise.resolve, Promise.reject)
    .then(data => dispatch(courseSearchSuccess(data)));

/**
 * returns if str is "" or NULL
 *  else trim additional comments and pass result to parsePr
 * @ param (string) str is list of prerequisites to be parsed
 */
const preProcess = (str) => {
  if (str === null || str === "") {
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
    var course = /[A-Z]{3,4}\s*\d{2,3}[A-Z]{0,1}/;
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
