import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Card, List} from 'semantic-ui-react'
import CourseBookmark from './CourseBookmark'
import CourseLabel from './CourseLabel'
import CourseConflictLabel from './CourseConflictLabel'
import exemptions from '../../data/exemptions'
import _ from 'lodash';

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
            prnote: course.prnote,
            pr: course.pr,
            conflict: course.conflict
        });
    };

    createPrerequisites = () => {
        let { pr } = this.state;
        return ((!!pr)? <List ><span>
                &nbsp; <span class="label">pre-req</span>: {this.createLabels(pr)}</span></List> : '');
    }

    createConflicts = () => {
      let { conflict } = this.state;
      return ((!!conflict)? <List >{this.createConflictLabels(conflict)}</List> : '');
    }

    createConflictLabels = (result) => {
      console.log(result)
      if (result.length > 0) {
        return (<span class="label">
                &nbsp;conflict:  {result.map(function(el) {
                  return (<CourseConflictLabel courseId={el} />);
                })}
                </span>
            )
      }
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
        const { id, name, description, prnote } = this.props.course;
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

            {this.createPrerequisites()}
              <div>  { prnote } </div>
                {this.createConflicts()}
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
