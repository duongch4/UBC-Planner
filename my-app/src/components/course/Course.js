import React from 'react'
import PropTypes from 'prop-types';
import { Card, Icon, Label, List } from 'semantic-ui-react'
import LoginStore from "../../stores/LoginStore";
import CourseSearchStore from "../../stores/CourseSearchStore";
import CourseSearchActions from "../../actions/CourseSearchActions";

class Course extends React.Component {

    constructor(course) {
        super();
        this.state = course;
    }

    _onChange = () => {
        this.setState({
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            cr: this.props.cr,
            pr: this.props.pr
        });
    }
    componentDidMount = () => CourseSearchStore.addChangeListener(this._onChange);
    componentWillUnmount = () => CourseSearchStore.removeChangeListener(this._onChange);

    createPrerequisites = () => {
        let { pr } = this.state;
        return <List >{this.createLabels(pr)}</List>;
    }

    onLabelClick=(e, o)=>{
        console.log(e, o);
        CourseSearchActions.query({
            query: o.children,
            results: [o.children]
        })
    }

    createLabels = (item) => {
        if (typeof item === 'string') {

            let isTaken = this.checkIfTaken(item);
            return (<Label as='a'
                           size={'mini'}
                           color={ isTaken? 'olive':''}
                           onClick={(e,o)=>{this.onLabelClick(e, o)}}>
                {item}
                </Label>)
        } else if (item && item.or)
            return (<List.Item>
                    &nbsp; one of: [ {item.or.map(function(el) { return this.createLabels(el); }.bind(this)) } ]
                </List.Item>
            )
        else if (item && item.and)
            return (<List.Item>
                    &nbsp; all of: [ {item.and.map(function(el) { return this.createLabels(el); }.bind(this)) } ]
                </List.Item>
            )
    }

    checkIfTaken = (id) => {
        let course = LoginStore.user.courses
        course = course[id]

        return course && !!course.grade;
    }

    render() {
        const { id, name, description, credits } = this.state
        return <Card color={'blue'}>
            <Card.Content>
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

Course.propTypes = {
    course: PropTypes.object.isRequired
};

export default Course;