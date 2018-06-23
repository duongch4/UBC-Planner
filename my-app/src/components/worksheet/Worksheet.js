import React from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Table, Icon } from 'semantic-ui-react'
import WorksheetCourseRemark from "./WorksheetCourseRemark";
import './Worksheet.css'

class Worksheet extends React.Component
{

    state = {
        inEditMode: null
    }

    handleRemarksEdit = cell => {
        if (!!this.state.inEditMode && this.state.inEditMode!=cell) this.state.inEditMode.onSubmit();
        console.log(this.state.inEditMode);
        this.state.inEditMode = cell;
        console.log(cell);
    };

    createWorksheetCells = (requirements, courses, remarks) => {
        const courseNames = Object.keys(courses);
        return requirements.map((requirement) => {
            const matchingCourseId = courseNames.find(name =>((courses[name].id === requirement.id) | (courses[name].creditFor === requirement.id)));
            const hasCompleted = matchingCourseId && courses[matchingCourseId].grade;
            const course = matchingCourseId && courses[matchingCourseId];

            return(
                <Table.Row
                           positive={!!hasCompleted}
                >
                    <Table.Cell textAlign='center'>
                        {!!hasCompleted && <Icon color='green' name='checkmark' size='large' />}
                        {!!matchingCourseId && course.year}
                    </Table.Cell>
                    <Table.Cell>{requirement.name}</Table.Cell>
                    <Table.Cell>{matchingCourseId && course.id}</Table.Cell>
                    <Table.Cell className={"remark-cell"}>
                        <WorksheetCourseRemark
                            onClick     ={this.handleRemarksEdit.bind(this)}
                            isEditMode  ={false}
                            courseId    ={requirement.id}
                            remarks     ={remarks[requirement.id]} />
                    </Table.Cell>
                </Table.Row>)
            });
    };

    render = () => {
        const { requirements, courses, remarks } = this.props;
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
                    {this.createWorksheetCells(requirements, courses, remarks)}
                </Table.Body>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    requirements: state.bcs.requirements,
    courses: state.student.courses,
    remarks: state.student.remarks
});

Worksheet.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
    // , getProfiles: PropTypes.func.isRequired
    // , setProfile: PropTypes.func.isRequired
};

export default connect(
    mapStateToProps
)(Worksheet);