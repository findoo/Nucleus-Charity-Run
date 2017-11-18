import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';

export default class Marker extends PureComponent {

    render() {
        return (
            <Mark>
                {this.props.text}
            </Mark>
        );
    }
}

const Mark = styled.div`
    position: absolute;
    width: 40;
    height: 40;
    left: -20;
    top: -20;
    border: 5px solid #f44336;
    border-radius: 40;
    background-color: white;
    text-align: center;
    color: #3f51b5;
    font-size: 16;
    font-weight: bold;
    padding: 4px;
`;

