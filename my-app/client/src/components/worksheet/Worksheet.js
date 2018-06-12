import React from 'react'
import { Table, Icon } from 'semantic-ui-react'

const Worksheet = () => (
    <Table celled selectable className = 'Worksheet-table'>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Courses</Table.HeaderCell>
                <Table.HeaderCell>Completed/Exempted</Table.HeaderCell>
                <Table.HeaderCell>Explanation</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell textAlign='center'>
                </Table.Cell>
                <Table.Cell>Pre-admission
                   1st Year English</Table.Cell>
                <Table.Cell>Exempted</Table.Cell>
                <Table.Cell>Approved first-year ENGL course
                    required prior to admission.</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign='center'>
                </Table.Cell>
                <Table.Cell>ENGL 1xx</Table.Cell>
                <Table.Cell >Exempted</Table.Cell>
                <Table.Cell>Another first-year ENGL course</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>CPSC 110</Table.Cell>
                <Table.Cell positive>Completed</Table.Cell>
                <Table.Cell>Or 85% or more in CPSC 111, or a
                    pass for both CPSC 111 and 211</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>CPSC 121</Table.Cell>
                <Table.Cell positive>Completed</Table.Cell>
                <Table.Cell>Another first-year ENGL course</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>MATH 180</Table.Cell>
                <Table.Cell positive>MATH 221</Table.Cell>
                <Table.Cell>Or MATH 184, 100, 102, …</Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>STAT 203</Table.Cell>
                <Table.Cell positive> STAT 200</Table.Cell>
                <Table.Cell>Or STAT 200 or STAT 241</Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>Communication</Table.Cell>
                <Table.Cell positive>COMM 457</Table.Cell>
                <Table.Cell>ENGL 301, SCIE 300, or approved
                    alternative.</Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>CPSC 210</Table.Cell>
                <Table.Cell positive>Completed</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>CPSC 221</Table.Cell>
                <Table.Cell positive>Completed</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large' />
                </Table.Cell>
                <Table.Cell>CPSC 213</Table.Cell>
                <Table.Cell positive>Completed</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 310</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 320</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 313</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 3XX</Table.Cell>
                <Table.Cell warning>CPSC 304</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 3xx</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 4xx</Table.Cell>
                <Table.Cell warning>CPSC 490</Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>CPSC 4xx</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>BM</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>BM</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>BM</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>BM</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
            <Table.Row >
                <Table.Cell></Table.Cell>
                <Table.Cell>BM</Table.Cell>
                <Table.Cell warning></Table.Cell>
                <Table.Cell></Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
);

export default Worksheet