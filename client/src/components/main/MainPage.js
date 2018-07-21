import './MainPage.css';
import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getRequirements } from "../../api/BCSApi";
import {doLogout} from "../../api/LoginApi";
import WorksheetPage from "../worksheet/WorksheetPage";
import CoursePage from "../course/CoursePage";
import PlannerPage from "../planner/PlannerPage";
import { Menu, Container, Dropdown, Sticky } from 'semantic-ui-react'

class MainPage extends React.Component {

    constructor () {
        super();
        this.MainMenu = React.createRef();
    }

    state = { activeItem: 'worksheet' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    logout = () => this.props.doLogout();


    getOffset = (element) => {
        let bounding = element.getBoundingClientRect();
        return {
            top: element.offsetTop + document.body.scrollTop,
            left: bounding.left + document.body.scrollLeft
        };
    };

    handleScroll = () => {
        let windowsScrollTop  = window.pageYOffset;
        let mainMenu = this.MainMenu.current.parentElement;
        let offset = this.getOffset(mainMenu);
        if(windowsScrollTop >= offset.top){

            mainMenu.classList.add("inverted");
            mainMenu.classList.add("custom");
        }else if (mainMenu.classList.contains("inverted")){
            mainMenu.classList.remove("inverted");
            mainMenu.classList.remove("custom");
        }
    };

    componentDidMount = () => {
        window.addEventListener('scroll', this.handleScroll);
    };
    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll);
    };

    componentWillMount = () => {
        const {getRequirements} = this.props;
        getRequirements();
    }

    render() {
        const { activeItem } = this.state;
        const { name } = this.props.student;

        console.log(name);

        return (
            <div>
                <Menu pointing secondary  id='MainMenu'>
                    <span ref={this.MainMenu}>
                        {/*<img src={logo}/>*/}
                    </span>
                    <Menu.Item
                        name='worksheet'
                        active={activeItem === 'worksheet'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='planner'
                        active={activeItem === 'planner'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='courses'
                        active={activeItem === 'courses'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Menu position='right'>
                        <Dropdown item text={name}>
                            <Dropdown.Menu>
                                <Dropdown.Item>Account</Dropdown.Item>
                                <Dropdown.Item
                                    active={activeItem === 'logout'}
                                    onClick={this.logout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Menu>
                </Menu>
                <Container>
                    {activeItem === 'worksheet' && <WorksheetPage/>}
                    {activeItem === 'courses' && <CoursePage/>}
                    {activeItem === 'planner' && <PlannerPage/>}
                </Container>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    student: state.student.info
});

MainPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    student: PropTypes.Object,
    getRequirements: PropTypes.func.isRequired
};

export default connect(
    mapStateToProps,
    {getRequirements, doLogout}
)(MainPage);