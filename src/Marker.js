import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    top: -5px;
    border: 2px solid orange;
    border-radius: 10px;
    background-color: white;
    font-family: vag-rounded-light,Helvetica,Arial,sans-serif;
    text-align: center;
    color: #3f51b5;
    font-weight: bold;
    padding: 4px;
`;

Marker.propTypes = {
    text: PropTypes.string
};