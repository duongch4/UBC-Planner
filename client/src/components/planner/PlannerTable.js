import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon, Button, Divider } from 'semantic-ui-react';
import { editTerm } from '../../actions/CoursePlannerAction'
import PlannerForm from './PlannerForm';
import PlannerInputRow from './PlannerInputRow';

class PlannerTable extends React.Component {

    constructor(props) {
        super();

        const fullTermName = props.year + props.season + props.term;
        this.state = {
            inEditMode: false,
            fullTermName: fullTermName,
            courses: props.planner[fullTermName] || [],
            term: props.term,
            year: props.year,
            season: props.season,
        };
    }


    componentWillReceiveProps = nextProps => {
        const fullTermName = nextProps.year + nextProps.season + nextProps.term;
        const {term, year, season} = nextProps;
        this.setState({ inEditMode: false, courses: nextProps.planner[fullTermName], fullTermName, term, year,season });
    };

    renderRow = (courses, term, year, season) => {
        let result = [];
        let keys = courses || [];

        console.log('RENDER_ROW', courses);

        if (keys.length === 0) {
            this.addRow();
            return;
        }

        keys.forEach(courseId => {
            result.push(
                <PlannerInputRow courseId   = { courseId }
                                 term       = { term }
                                 year       = { year+season }
                                 inEditMode = { courseId === "" }
                                 onEditMode = { this.handleEdit }
                                 onSubmit   = { this.onSubmit }
                />);
        });

        return result
    }

    addRow = () => {
        let { courses, inEditMode } = this.state;
        if (inEditMode) return alert('Save current course first!');

        let newCourses  = Object.assign([], courses);
        newCourses.push(null);

        this.setState({inEditMode: true, courses: newCourses})
    }

    handleEdit = row => {
        if (!!this.state.inEditMode && this.state.inEditMode !== row) {
            alert('Save current course first!');
            return false;
        } else {
            this.state.inEditMode = row;
            this.setState({error: null})
            return true;
        }
    }

    onTermChange = row => {
        this.setState({inEditMode:false, error: null})
        this.props.onTermChange(row);
    }

    onSubmit = row => {
        let { courses } = this.state;
        let newCourses;
        if (!row.state.courseId || row.state.courseId==="") newCourses = courses.filter(courseId => courseId);
        else newCourses = courses;

        this.setState({inEditMode: false, courses: newCourses});
        this.props.onSubmit(row);
    }

    render () {
        // const { term, year, season, fullTermName, planner    } = this.props;
        const { term, year, season, courses, inEditMode } = this.state;

        return (
            <div class="planner-table-wrapper">
                <Divider hidden />
                <PlannerForm onSubmit={this.onTermChange} onClick={this.handleEdit} term={term} year={year} season={season}/>
                <Divider hidden />
                <div class="">
                    <Table compact basic='very' selectable color={'blue'} textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={3}>Course</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Section</Table.HeaderCell>
                                <Table.HeaderCell width={3}>BCS requirement</Table.HeaderCell>
                                <Table.HeaderCell width={3}>Grade</Table.HeaderCell>
                                <Table.HeaderCell width={1}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.renderRow(courses, term, year, season) }
                        </Table.Body>
                    </Table>
                </div>
                {(!inEditMode) && (<div class='add-row-button-wrapper'>
                    <Button circular size={'mini'} color='olive' icon='plus' content={'add'} onClick={ this.addRow } />
                </div>)}
            </div>
    )};
}

PlannerTable.PropTypes = {
    term: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    season: PropTypes.string.isRequired,
    onTermChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    planner: state.student.planner
});
export default connect (
    mapStateToProps,
    { editTerm }
)(PlannerTable);