import React, { Component } from 'react';
import {connect} from "react-redux";
import _ from 'lodash';
import { Form, Search } from 'semantic-ui-react';
import {doSearch, doAutocompleteCourse, doAutocompleteDepartment, doAutocompleteSelect, doLoadDepartment, doUnloadDepartment} from "../../api/CourseSearchApi";
import {reset, courseSearchSuccess, courseAutocompleteSelect} from "../../actions/CourseSearchActions";

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const baseURL = 'https://courses.students.ubc.ca/cs/servlets/SRVCourseSchedule?';
const url = proxyUrl + baseURL + '&sessyr=' + new Date().getFullYear() + '&sesscd=W&req=0&output=3';
const parseString = require('react-native-xml2js').parseString;

class CourseSearch extends Component {

    resetComponent = () => {
        reset();
        this.setState({ isLoading: false, result: [], value: ''})
    }

    getSearchList = () => {
      let init = {
         method: 'GET'
      };
      fetch (url, init)
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

    componentWillMount = () => {
      this.resetComponent();
  //    this.getSearchList(); //output is in courseSearchList.json -> save as state??
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
            } else if (this.state.value.length < 5) {
              this.props.doAutocompleteDepartment(this.state.value);
              this.props.doUnloadDepartment();
              this.setState({ isLoading: false, value })
            } else if (this.state.value.length == 5) {
          //    this.props.doAutocompleteDepartment(this.state.value);
              this.props.doLoadDepartment(this.state.value);
              this.props.doAutocompleteCourse(this.state.value)
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
