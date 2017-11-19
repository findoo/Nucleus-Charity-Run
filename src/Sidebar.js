import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';

import AthleteTable from './AthleteTable';
import Link from './Link';

export default class Sidebar extends Component {

    state = {
        hidden: false
    }

    toggleSidebar = () => { this.setState({ hidden: !this.state.hidden }); }

    render() {
        return (
            <Bar hide={this.state.hidden}>
                <HideDiv onClick={this.toggleSidebar}>{this.state.hidden ? '<' : '>'}</HideDiv>
                {!this.state.hidden && <div>
                    <h1>Nucleus Charity 2018</h1>
                    <h2>{'Lands End to John O\' Groats'}</h2>
                    <AthleteTable athletes={this.props.athletes} targetDistance={this.props.targetDistance} />
                    <h3>Want to join in? Join the <Link href='https://www.strava.com/clubs/175865'>Nucleus Club</Link>,
                        and then please <Link href='/auth'>authenticate</Link></h3>
                </div>}
            </Bar>
        );
    }
}

const Bar = styled.div`
    height: 100%;
    background-color: #fff;
    position: fixed! important;
    z-index: 1;
    overflow: auto;
    box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    right: 0;
    top: 0;
    padding: 18px;

    @media (min-width: 750px) {
        width: ${props => props.hide ? '20px' : '35vw'};
    }

    @media (max-width: 750px) {
        width: ${props => props.hide ? '20px' : '95vw'};
    }
`;

const HideDiv = styled.div`
    float: right;
    font-size: 40px;
    cursor: pointer;
`;