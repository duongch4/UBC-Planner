import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Divider, Label, Dropdown, Button} from "semantic-ui-react"
// import {editTerms} from "../../api/WorksheetApi";
import {editTerm} from "../../actions/CoursePlannerAction";

class PlannerForm extends React.Component {

    state = {
        isEditMode: false,
        year: this.props.year,
        season: this.props.season,
        term: this.props.term,
        origTerm: this.props.year+this.props.season+this.props.term,
        error: null
    }

    componentWillReceiveProps = nextProps => {
        const { isEditMode, year, season, term } = nextProps;
        this.setState(Object.assign({}, { isEditMode, term, year, season, term, origTerm: (year+season+term), error: null }));
    };

    validate = () => {
        const { year, season, term} = this.state;
        var data = year+season+term;
        const terms = this.props.planner && Object.keys(this.props.planner);
        if (terms && terms.find(term => { return term === data })) return "Already exists"
        return;
    };

    onClick = () => {
        if (this.props.onClick(this))
            this.setState({isEditMode: true});
    }

    onSubmit = e => {
        const newTerm = this.state.year + this.state.season + this.state.term;
        if (newTerm === this.state.origTerm) {
            this.onCancel(e);
        }

        var error = this.validate();
        if (error) return this.setState({error})

        //       [2] API call
        this.props.editTerm({
            origTerm: this.state.origTerm,
            newTerm: newTerm,
            year: this.state.year + this.state.season,
            term: this.state.term,
            email: this.props.email
        })

        this.setState({isEditMode: false, origTerm: newTerm});
        this.props.onSubmit({newTerm});
    }

    onCancel = e => {
        this.setState(Object.assign({}, { isEditMode:false,
            term:this.props.term,
            year:this.props.year,
            season:this.props.season,
            error: null }));
        this.props.onSubmit(this);
    }

    onChangeText = (e, { value, name }) => this.setState({ ...this.state, [name]: value });

    generatePossibleYears = (cohort) => {
        var options = [];
        var max = 6;
        while (max--) {
            options.push({key:cohort, value:cohort, text:cohort});
            cohort++;
        }
        return options;
    }

    render() {
        const {cohort} = this.props;
        const {isEditMode, year, season, term, error, origTerm} = this.state;
        return (
            <div onClick={this.onClick}>
                {!isEditMode && <h1 class="remark-div">{origTerm}</h1>}
                {isEditMode && (
                    <Form onSubmit={this.onSubmit}>
                        {error &&
                            <div><Label basic color='red' pointing={'below'}>
                                {error}
                            </Label>
                            </div>
                        }
                        <div>
                            <span>
                                <Dropdown selection
                                          search
                                          value={year}
                                          onChange={this.onChangeText}
                                          name={'year'}
                                          type={'number'}
                                          autofocus
                                          compact
                                          options={this.generatePossibleYears(cohort)}
                                />
                                <Dropdown value={season}
                                          selection
                                          onChange={this.onChangeText}
                                          name={'season'}
                                          search
                                          compact
                                          options={[{key:'S',value:'S', text:'S'}, {key:'W',value:'W', text:'W'}]}
                                />
                                <Dropdown value={term}
                                          selection
                                          search
                                          compact
                                          onChange={this.onChangeText}
                                          name={'term'}
                                          options={[{key:1,value:1, text:1}, {key:2,value:2, text:2}]}
                                />
                            </span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {/*<Button.Group size={'mini'}>*/}
                                <Button className='ubc-button' size={'mini'} circular onClick={this.onSubmit}>Save</Button>
                            {/*</Button.Group>*/}
                        </div>
                    </Form>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    email: state.student.info.email,
    planner: state.student.planner,
    cohort: state.student.info.cohort
});

PlannerForm.propTypes = {
    year: PropTypes.number.isRequired,
    season: PropTypes.string.isRequired,
    term: PropTypes.number.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default connect (
    mapStateToProps,
    {editTerm}
    ) (PlannerForm);
