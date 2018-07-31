import React, { Component } from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import { Form, Search } from 'semantic-ui-react';
import {doSearch, doAutocompleteCourse, doAutocompleteDepartment, doAutocompleteSelect, doLoadDepartment, doUnloadDepartment} from "../../api/CourseSearchApi";
import {reset, courseSearchSuccess, courseAutocompleteSelect} from "../../actions/CourseSearchActions";
const cheerio = require('cheerio');
const request = require('request');

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseUrl = 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
const deptUrl = proxyUrl + baseUrl + '&sessyr=' + new Date().getFullYear() + '&sesscd=W&req=0&output=3';
const creditExclusionUrl = proxyUrl + "http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,215,410,414"
const parseString = require('react-native-xml2js').parseString;


class CourseSearch extends Component {

    resetComponent = () => {
        reset();
        this.setState({ isLoading: false, result: [], value: ''})
    }

    getSearchList = () => {
      fetch (deptUrl, { method: 'GET' })
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

    getCreditExclusionList = () => {
      var array = [];
      request(creditExclusionUrl, (error, response, html) => {
        if (!error) {
          var $ = cheerio.load(html);
          $(".double li").each(function() {
            var courses = $(this).text();
            array.push(courses);
          })
          this.createJsonArray(array).then((data) => {
            return this.modifyExemptionArray(data);
          })
          .then((data) => console.log(JSON.stringify(data)))
    }
  });
}

createJsonArray = (array) => new Promise((resolve, reject)=> {
  var result = array.map((courses) => {
    var exemptions = [];
    var code, deptName = "";
    var json = {};
    if (/,\s+/.test(courses)) {
      courses = courses.split(/,\s+/);
      code = courses[0];
      deptName = code.split(/\s+/)[0];
      exemptions = courses.splice(1);
    }
    json[code] = exemptions;
    return json;
  })
  resolve(result);
  }, Promise.resolve, Promise.reject)


modifyExemptionArray = (array) => new Promise((resolve, reject)=> {
  var result = array.map((json) => {
    var code = Object.keys(json)[0];
    var curr = code.split(/\s+/)[0];
    var exemptions = Object.values(json)[0];
    for (var i = 0; i < exemptions.length; i++) {
      var exemption = exemptions[i];
      exemption = exemption.replace(/\s*\n\s*/, "");
      if (/[A-Z]{2,4}\s+\d/.test(exemption)) {
        curr = exemption.split(/\s+/)[0];
        exemptions[i] = exemption;
      } else {
        exemptions[i] = curr + " " + exemption;
      }
    }
  var json = {};
  json[code] = exemptions;
  return json;
});
  resolve(result);
  }, Promise.resolve, Promise.reject)

    componentWillMount = () => {
      this.resetComponent();
      // to update department list: save printed results in courseSearchList.json
  //    this.getSearchList();
      this.getCreditExclusionList();
    }

    handleResultSelect = (e, { result }) => {
        this.setState({ value: '' })
        this.props.doAutocompleteSelect( result.title );
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) {
              return this.resetComponent()
            } else if (this.state.value.length < 4) {
              this.props.doAutocompleteDepartment(this.state.value);
              this.props.doUnloadDepartment();
              this.setState({ isLoading: false, value })
            } else if (this.state.value.length == 4) {
              this.props.doAutocompleteDepartment(this.state.value);
              this.props.doLoadDepartment(this.state.value);
          //    this.props.doAutocompleteCourse(this.state.value)
              this.setState({ isLoading: false, value })
            } else {
              this.props.doAutocompleteCourse(this.state.value)
              this.setState({ isLoading: false, value })
            }
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
    {doSearch, doAutocompleteDepartment, doAutocompleteCourse, courseAutocompleteSelect, doAutocompleteSelect, doLoadDepartment, doUnloadDepartment}
    ) (CourseSearch)
