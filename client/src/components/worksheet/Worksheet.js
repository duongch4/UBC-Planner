import React from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Table, Icon } from 'semantic-ui-react'
import WorksheetCourseRemark from "./WorksheetCourseRemark";
import './Worksheet.css'
import WorksheetCourseId from "./WorksheetCourseId";

class Worksheet extends React.Component {
    state = {
        inEditMode: null,
        creditFor: this.props.creditFor
    };

    componentWillReceiveProps = nextProps => {
        const { creditFor } = nextProps;
        this.setState({ creditFor });
    };

    handleRemarksEdit = (cell) => {
        if (!!this.state.inEditMode && this.state.inEditMode !== cell)
            this.state.inEditMode.onSubmit();

        this.state.inEditMode = cell;
    };

    createWorksheetCells = (requirements, courses, remarks, creditFor) => {
        return requirements.map((requirement) => {
            const matchingCourseId = creditFor && creditFor[requirement.id];
            const hasCompleted = matchingCourseId && courses[matchingCourseId].grade;
            const course = matchingCourseId && courses[matchingCourseId];

            return(
                <Table.Row key = {requirement.id}
                           positive={!!hasCompleted}>
                    <Table.Cell textAlign='center'>
                        {!!hasCompleted && <Icon color='green' name='checkmark' size='large' />}
                        {!!matchingCourseId && ((course.year + course.term) || "")}
                    </Table.Cell>
                    <Table.Cell>{requirement.name}</Table.Cell>
                    <Table.Cell>
                        <WorksheetCourseId
                        onClick         ={this.handleRemarksEdit.bind(this)}
                        isEditMode      ={false}
                        courseId        ={matchingCourseId}
                        requirementId   ={requirement.id}
                    /></Table.Cell>
                    <Table.Cell className={"remark-cell"}>
                        <WorksheetCourseRemark
                            onClick     ={this.handleRemarksEdit.bind(this)}
                            isEditMode  ={false}
                            courseId    ={requirement.id}
                            remarks     ={remarks && remarks[requirement.id]} />
                    </Table.Cell>
                </Table.Row>)
            });
    };

    render = () => {
        const { requirements, courses, remarks } = this.props;
        const { creditFor } = this.state;
        return (
            <Table celled selectable className='Worksheet-table'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell>Requirements</Table.HeaderCell>
                        <Table.HeaderCell>Courses</Table.HeaderCell>
                        <Table.HeaderCell>Remarks</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.createWorksheetCells(requirements, courses, remarks, creditFor)}
                </Table.Body>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    requirements: state.bcs.requirements,
    courses     : state.student.courses,
    remarks     : state.student.remarks,
    creditFor   : state.student.creditFor
});

Worksheet.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    })
};

export default connect(
    mapStateToProps
)(Worksheet);