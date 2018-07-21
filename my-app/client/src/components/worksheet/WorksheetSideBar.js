import React from 'react'
import PropTypes from "prop-types";
import Worksheet from "./Worksheet";
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react'
import WorksheetSummary from "./WorksheetSummary";


class WorksheetSideBar extends React.Component {
    state = { visible: true }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    render() {
        const { visible } = this.state
        return (
                <Sidebar.Pushable >
                    <Sidebar
                        as={Menu}
                        animation='push'
                        width='thin'
                        visible={visible}
                        icon='labeled'
                        vertical
                        inverted
                        onClick={this.toggleVisibility}
                    >
                        <Menu.Item name='home'>
                            <Icon name='home' />
                            Home
                        </Menu.Item>
                        <Menu.Item name='gamepad'>
                            <Icon name='gamepad' />
                            Games
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic>
                            <WorksheetSummary/>
                            <Worksheet/>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
        )
    }
}

WorksheetSideBar.propTypes = {

};

export default WorksheetSideBar;