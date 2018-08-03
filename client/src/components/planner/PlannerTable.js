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
            courses: props.planner[fullTermName] || []
        }

        console.log('constructor', this.courses);
    }


    componentWillReceiveProps = nextProps => {
        const fullTermName = nextProps.year + nextProps.season + nextProps.term;
        this.setState({ inEditMode: false, courses: nextProps.planner[fullTermName], fullTermName });
    };

    createRow = (courses, term) => {
        let result = [];
        let keys = courses || [];

        console.log('createRow', courses);

        if (courses.length === 0) {
            this.addRow();
            return;
        }

        courses.forEach(courseId => {
            result.push(
                <PlannerInputRow courseId   = { courseId }
                                 term       = { term }
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
        console.log('createRow', courses);
        newCourses.push(null);

        this.setState({inEditMode: true, courses: newCourses})
    }

    handleEdit = () => {
        this.setState({inEditMode:true, error: null})
    }

    onSubmit = data => {
        this.setState({inEditMode:false, error: null})
        this.props.onSubmit(data);
    }

    render () {
        const { term, year, season, fullTermName, planner    } = this.props;
        const {courses} = this.state;

        return (
            <div class="planner-table-wrapper">
                <Divider hidden />
                <PlannerForm onSubmit={this.onSubmit} onClick={this.handleEdit} term={term} year={year} season={season}/>
                <Divider hidden />
                <div class="">
                    <Table compact basic='very' selectable color={'blue'} textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={4}>Course</Table.HeaderCell>
                                <Table.HeaderCell width={4}>Section</Table.HeaderCell>
                                <Table.HeaderCell width={4}>BCS requirement</Table.HeaderCell>
                                <Table.HeaderCell width={4}>Grade</Table.HeaderCell>
                                <Table.HeaderCell width={1}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.createRow(courses, fullTermName) }
                        </Table.Body>
                    </Table>
                </div>
                <div class='add-row-button-wrapper'>
                    <Button circular size={'mini'} color='olive' icon='plus' content={'add'} onClick={ this.addRow } />
                </div>
            </div>
    )};
}

PlannerTable.PropTypes = {
    term: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
    season: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    planner: state.student.planner
});
export default connect (
    mapStateToProps,
    { editTerm }
)(PlannerTable);