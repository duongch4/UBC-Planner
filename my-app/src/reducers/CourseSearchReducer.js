// import {PROGRAM_REQUIREMENTS_LOADED} from "../constants/BCSConstnats";
import { ON_AUTOCOMPLETE_SUCCESS, ON_AUTOCOMPLETE_SELECT, ON_QUERY_SUCCESS } from "../constants/CourseSearchConstants";
import { LOG_OUT } from "../constants/LoginConstants";
var async = require('async');

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = proxyUrl + 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
const parseString = require('react-native-xml2js').parseString;

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
      var { id } = action;
      const { autocomplete_orig, history } = state;
      var result;
      history.push(id); //ignore
    //  var result = autocomplete_orig.filter(course => (course.id === id)); //just fetch data for id (dept name) in autocomplete_orig and parse
      getCourses([id]).then((courses) => result = courses);
      // have to complete getCourses before returning -> promise
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

const getCourses = (depts) => {
  var promise = new Promise ((resolve, reject) => {
  let init = {
    method: 'GET'
  };
  var courses = [];
  async.eachLimit(depts, 10, (dept, callback) => {
    fetch(baseURL + '&sessyr=2018&sesscd=W&req=2&dept=' + dept + '&output=3', init)
      .then((response) => response.text())
      .then((responseText) => {
        parseString(responseText, (err, result) => {
          if (!err) {
          async.map(result.courses.course, (course, callback) => {
            var json;
            if (!course.$.hasOwnProperty("prereqs")) {
              json = {
                "id": dept + ' ' + course.$.key,
                "name": course.$.title,
                "description": course.$.descr,
                "credits": '',
              }
            } else {
              json = {
                "id": 'CPSC' + ' ' + course.$.key,
                "name": course.$.title,
                "description": course.$.descr,
                "credits": '',
      //          "pr": this.preProcess(course.$.prereqs)
              }
            }
            callback(null, json);
          }, (err, jsonArray) => {
            courses = courses.concat(jsonArray);
            console.log(courses)
          });
        }
            callback(null);
        });
      })
  })
  resolve(courses);
});
  return promise;
}

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
  return this.parsePr(str);
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
      orResult.push(this.parsePr(orSplit[i]));
    }
    var or = {
      or: orResult
    };
    var andSplit = orTrim[0].split(/\s*and\s*/);
    var andResult = [];
    for (var i = 0; i < andSplit.length; i++) {
      andResult.push(this.parsePr(andSplit[i]));
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
      orResult.push(this.parsePr(orSplit[i]));
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
      andResult.push(this.parsePr(andSplit[i]));
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

export default CourseSearchReducer;
