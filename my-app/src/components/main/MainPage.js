import './MainPage.css';
import React from 'react'
import PropTypes from "prop-types";
import LoginActions from "../../actions/LoginActions";
import LoginStore from "../../stores/LoginStore";
import WorksheetPage from "../worksheet/WorksheetPage";
import { Menu, Container, Dropdown, Sticky } from 'semantic-ui-react'


export default class MainPage extends React.Component {

    constructor () {
        super();

        this.MainMenu = React.createRef();
    }

    state = { activeItem: 'worksheet' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    logout = () => LoginActions.logout();


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

    render() {
        const { activeItem } = this.state;
        let name = LoginStore.user && LoginStore.user.name;

        return (
            <div>
                <Menu pointing secondary  id='MainMenu'>
                    <span ref={this.MainMenu}></span>
                    <Menu.Item
                        name='worksheet'
                        active={activeItem === 'worksheet'}
                        onClick={this.handleItemClick} />
                    <Menu.Item
                        name='courses'
                        active={activeItem === 'courses'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='timetable'
                        active={activeItem === 'timetable'}
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
                </Container>

            </div>
        )
    }
}

MainPage.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
};