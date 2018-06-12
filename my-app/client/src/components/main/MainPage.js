import './MainPage.css';
import React from 'react'
import PropTypes from "prop-types";
import LoginActions from "../../actions/LoginActions";
import LoginStore from "../../stores/LoginStore";
import Worksheet from "../worksheet/Worksheet";
import { Menu, Container, Dropdown } from 'semantic-ui-react'


class MainPage extends React.Component {

    state = { activeItem: 'worksheet' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    logout = () => LoginActions.logout();

    render() {
        const { activeItem } = this.state;
        let name = LoginStore.user && LoginStore.user.name;

        return (
            <div>
                <Menu pointing secondary  id='MainMenu'>
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
                    {activeItem === 'worksheet' && <Worksheet/>}
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

export default MainPage;