import _ from 'lodash';
import React, { Component } from 'react';
import { Form, Search, Grid, Header } from 'semantic-ui-react';
import CourseSearchAction from '../../actions/CourseSearchActions'
import CourseSearchStore from "../../stores/CourseSearchStore";

const orig  = require("../../data/courses");
const source = Object.keys(orig).map((id)=>{return {title: id, description: orig[id].name}});

export default class CourseSearch extends Component {

    resetComponent = () => this.setState({ isLoading: false, results: [], value: ''})
    componentDidMount = () => CourseSearchStore.addChangeListener(this.resetComponent)
    componentWillUnmount = () => CourseSearchStore.removeChangeListener(this.resetComponent)
    componentWillMount = () => this.resetComponent()

    handleResultSelect = (e, { result }) => {
        this.setState({ value: result.title })
        CourseSearchAction.query({
            query: result.title,
            results:[result.title]
        })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)
            this.setState({
                isLoading: false,
                results: _.filter(source, isMatch),
            })
        }, 0)
    }

    onSubmit = () => {
        console.log("submitted", this.state.value);
        CourseSearchAction.query({
            query: this.state.value,
            results: this.state.results.map((course) => {return course.title})
        })
    }

    render() {
        const { isLoading, value, results } = this.state

        return (
            <div class="course search">
            <Form onSubmit={ this.onSubmit }>
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 0, { leading: true })}
                    results={results}
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