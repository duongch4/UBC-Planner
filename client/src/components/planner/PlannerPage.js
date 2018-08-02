import React from 'react';
import { connect } from "react-redux";
import { Container, Header, Menu, Segment, Icon, Button, Divider } from 'semantic-ui-react';
import PlannerTable from "./PlannerTable";
import { addTerm } from '../../actions/CoursePlannerAction';
import './Planner.css'

class PlannerPage extends React.Component {

    constructor (props) {
        super();
        this.state = {
            planner: this.parseTerms(props.planner, props.cohort),
            activeItem: null,
            isTabEditMode: false,
            lastActive: null
        }

        if (this.state.planner.length !== 0) this.state.activeItem = this.state.planner[0];
    }

    parseTerms = (planner, cohort) => {
        cohort = cohort || this.props.cohort;
        let keys  = ( planner && Object.keys(planner) ) || [];
        keys = keys.filter(el=>{ return el!=='null' && (parseInt(el.substring(0, 4)) >= cohort);})
        keys && keys.sort();
        return keys;
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    handleAddNew = (e, { name }) => {
        const { planner } = this.state;
        let newTerm;
        if (!planner || !planner.length) {
            let date = new Date();
            let month = date.getMonth();
            let year = date.getFullYear();
            if (month <= 3) newTerm = year+"W"+2;
            else if (month <= 5) newTerm = year+"S"+1;
            else if (month <= 9) newTerm = year+"S"+2;
            else newTerm = (year+1)+"W"+1;
        } else {
            let lastEntry = planner[planner.length-1];
            if (lastEntry.charAt(5) == "1") {
                newTerm = lastEntry.slice(0, -1) + 2;
            } else if (lastEntry.charAt(4) == "W"){
                let year = parseInt(lastEntry.substring(0,4));
                newTerm = (++year) + "S1";
            } else {
                newTerm = lastEntry.substring(0, 4) + "W1";
            }
        }

        this.props.addTerm(newTerm);
        this.state.activeItem = newTerm;
    }

    componentWillReceiveProps = nextProps => {
        const { planner } = nextProps;
        const newPlanner = this.parseTerms(planner);
        this.setState({ planner: newPlanner });
    };

    createMenuItem = (activeItem, planner) => {
        // let years = ( planner && Object.keys(planner) ) || [];
        let items = [];
        planner && planner.sort();

        for (let ix = 0, ixLen = planner.length; ix < ixLen; ix++) {
            let el = planner[ix];
            if (el === 'null') continue;
            items.push(
                <Menu.Item name={el} active={activeItem === el} onClick={this.handleItemClick} />)
        }

        return items;
    };

    handleTermChangeSubmit = data => {
        const { newTerm } = data;
        if (newTerm) this.setState({activeItem: newTerm});
    }

    createSegment = (activeItem) => {
        console.log('activeItem:', activeItem);
        if (!activeItem)
            return (
                <div>
                    <Divider hidden/>
                    <Header as='h2' icon>
                        <Icon name='edit' />
                        Plan your BCS program now!
                        <Header.Subheader>Term by term plan your courses for BCS graduation.</Header.Subheader>
                    </Header>
                    <div>
                        <Button color='green' onClick={this.handleAddNew}>Start Now</Button>
                    </div>
                    <Divider hidden/>
                </div>
            )
        return <PlannerTable year={ parseInt(activeItem.substring(0,4)) }
                             season={activeItem.substring(4,5)}
                             term={ parseInt(activeItem.slice(-1)) }
                             onSubmit={this.handleTermChangeSubmit} />
    }

    render() {
        const { activeItem, planner }    = this.state;
        return (
            <Container>
                <Menu className={'planner-tab'} secondary size={'mini'}>
                    { this.createMenuItem(activeItem, planner)  }
                    <Menu.Item className='add' name='plus' onClick={this.handleAddNew}>
                        <Icon circular inverted={true} size={'small'} name='plus' color={'green'}/>
                    </Menu.Item>
                </Menu>
                <Segment>
                    { this.createSegment(activeItem) }
                </Segment>
            </Container>

        );
    }
}

const mapStateToProps = state => ({
    planner: state.student.planner,
    cohort: state.student.info.cohort
});
export default connect (
    mapStateToProps,
    { addTerm }
)(PlannerPage);