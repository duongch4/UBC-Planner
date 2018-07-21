import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Card, List} from 'semantic-ui-react'
import CourseBookmark from './CourseBookmark'
import CourseLabel from './CourseLabel'

class Course extends React.Component {

    constructor(course) {
        super();
        this.state = course;
    }

    componentWillReceiveProps = nextProps => {
        console.log("nextProps",nextProps);
        const { course } = nextProps;
        this.setState({
            id: course.id,
            name: course.name,
            description: course.description,
            cr: course.cr,
            pr: course.pr,
        });
    };

    createPrerequisites = () => {
        let { pr } = this.state;
        return ((!!pr)? <List >{this.createLabels(pr)}</List> : '');
    }


    createLabels = (item) => {
        console.log("create");
        if (typeof item === 'string') {
            return (<CourseLabel courseId={ item } />)
        } else if (item && item.or)
            return (<span>
                    &nbsp; one of: [ {item.or.map(function(el) {
                        return this.createLabels(el); }.bind(this)) } ]
                </span>
            )
        else if (item && item.and)
            return (
                <span>
                    &nbsp; all of: [ {item.and.map(function(el) { return this.createLabels(el); }.bind(this)) } ]
                </span>
            )
        else if (item && item.twoOf)
                return (<span>
                        &nbsp; two of: [ {item.twoOf.map(function(el) {
                            return this.createLabels(el); }.bind(this)) } ]
                    </span>
                )
    }

    checkIfTaken = (id) => {
        const { courses } = this.props;
        if (!courses) return 'grey';
        const course = courses[id];
        if (!course) return 'grey';
        if (!!course.grade) return 'green';
        return 'olive';
    }

    render() {
        const { id, name, description, credits } = this.props.course;
        const { courses } = this.props;
        const color = this.checkIfTaken(id);
        return <Card color={'blue'}>
            <Card.Content>
                <CourseBookmark {...this.props} color = {color}/>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>{id}</Card.Meta>
                <Card.Description>{description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div>{ credits } credits</div>
                {this.createPrerequisites()}
            </Card.Content>
        </Card>
    }
}

const mapStateToProps = state => ({
    courses: state.student.courses
})

Course.propTypes = {
    course: PropTypes.object.isRequired
};

export default connect (mapStateToProps) (Course)
