import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import { Form, Search } from 'semantic-ui-react';
import { doSearch, doAutocomplete } from "../../api/CourseSearchApi";
import { reset, courseSearchSuccess, courseAutocompleteSelect } from "../../actions/CourseSearchActions";

class CourseSearch extends Component {

    resetComponent = () => {
        reset();
        this.setState({ isLoading: false, result: [], value: ''})
    }

    componentWillMount = () => this.resetComponent();

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