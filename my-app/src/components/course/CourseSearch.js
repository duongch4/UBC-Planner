import React, { Component } from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import { Form, Search } from 'semantic-ui-react';
import {doSearch, doAutocomplete} from "../../api/CourseSearchApi";
import {reset, courseSearchSuccess, courseAutocompleteSelect} from "../../actions/CourseSearchActions";

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = proxyUrl + 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
const parseString = require('react-native-xml2js').parseString;
var print;

class CourseSearch extends Component {

    resetComponent = () => {
        reset();
        this.setState({ isLoading: false, result: [], value: ''})
    }

    getSearchList = () => {
      let init = {
         method: 'GET'
      };
      fetch (baseURL + '&sessyr=' + new Date().getFullYear() + '&sesscd=W&req=0&output=3', init)
        .then ((response) => response.text())
        .then ((responseText) => {
            parseString(responseText, function (err, result) {
              console.log(JSON.stringify(result))
            });
        })
        .catch((err) => {
            console.log('Error fetching the feed: ', err)
        })
    }

    /**
     * returns if str is "" or NULL
     *  else trim additional comments and pass result to parsePr
     * @ param (string) str is list of prerequisites to be parsed
     */
    preProcess = (str) => {
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
    parsePr = (str) => {
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

    //testing
    getSampleCourseList = () => {
      let init = {
         method: 'GET'
      };
      fetch (baseURL + '&sessyr=2018&sesscd=W&req=2&dept=' + 'CPSC' + '&output=3', init)
          .then ((response) => response.text())
          .then ((responseText) => {
              parseString(responseText, (err, result) => {
                console.log(result)
                  print = result.courses.course.map(course => {
                  if (!course.$.hasOwnProperty("prereqs")) {
                    return {
                       "id": 'CPSC' + ' ' + course.$.key,
                       "name": course.$.title,
                       "description": course.$.descr,
                       "credits": '',
                     }
                  } else {
                 return {
                    "id": 'CPSC' + ' ' + course.$.key,
                    "name": course.$.title,
                    "description": course.$.descr,
                    "credits": '',
                    "pr": this.preProcess(course.$.prereqs)
                  }
                }

                })
                console.log(print);
              });
          })
          .catch((err) => {
              console.log('Error fetching the feed: ', err)
          })
    }

    componentWillMount = () => {
      this.resetComponent();
      this.getSearchList();
      this.getSampleCourseList();
    }

    // fetch API subject codes and names: for autofill
    // create json file like data for autofill department names
    // fetch subject page:
    // can autofill and search for course code

    // fetch API results -> autofill queries
    // if multiple subject, search through each one
    // for all results (set limit), on submit:
    // load result: parse each course and push to result
    // do search and render

    handleResultSelect = (e, { result }) => {
        this.setState({ value: '' })
        this.props.courseAutocompleteSelect( result.title )
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()
            this.props.doAutocomplete(this.state.value);
            this.setState({ isLoading: false, value })
        }, 0)
    }

    onSubmit = () => {
        console.log("submitted", this.state.value);
        this.props.doSearch(this.state.value);
        this.setState({value: ''});
    }

    render() {
        const { isLoading, value, results } = this.state;
        const { autocomplete } = this.props;

        return (
            <div class="course search">
            <Form onSubmit={ this.onSubmit }>
                <Search loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 0, { leading: true })}
                        results={autocomplete}
                        value={value}
                        placeholder={'CPSC...'}
                        minCharacters={1}
                        showNoResults={false}
                        {...this.props}
                />
            </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    autocomplete: state.courseSearch.autocomplete
});

export default connect (
    mapStateToProps,
    {doSearch, doAutocomplete, courseAutocompleteSelect}
    ) (CourseSearch)
