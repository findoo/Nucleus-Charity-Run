import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BicycleIcon from 'react-icons/lib/fa/bicycle';
import RunIcon from 'react-icons/lib/md/directions-run';
import SwimIcon from 'react-icons/lib/ti/anchor';

import AthleteTable from './AthleteTable';
import Link from './Link';
import { SPORT_TYPE } from './App';

export default class Sidebar extends Component {

    state = {
        hidden: false,
        showActivites: false
    }

    toggleSidebar = () => { this.setState({ hidden: !this.state.hidden }); }

    toggleShowActivities = () => { this.setState({ showActivities: !this.state.showActivities }); }

    render() {
        return (
            <Bar hide={this.state.hidden} onClick={this.state.hidden ? this.toggleSidebar : () => {}}>
                <HideDiv onClick={this.toggleSidebar}>{this.state.hidden ? '<' : '>'}</HideDiv>
                {!this.state.hidden && !this.state.showActivities && <div>
                    <h1>Nucleus Charity 2018</h1>
                    <h2>{'Lands End to John O\' Groats'}</h2>
                    <RunIcon
                        size={35}
                        color={this.props.sport === SPORT_TYPE.RUN ? 'orange' : 'black'}
                        onClick={this.props.changeSport.bind(null, SPORT_TYPE.RUN)} />
                    <BicycleIcon
                        size={35}
                        color={this.props.sport === SPORT_TYPE.RIDE ? 'orange' : 'black'}
                        onClick={this.props.changeSport.bind(null, SPORT_TYPE.RIDE)} />
                    <SwimIcon
                        size={35}
                        color={this.props.sport === SPORT_TYPE.SWIM ? 'orange' : 'black'}
                        onClick={this.props.changeSport.bind(null, SPORT_TYPE.SWIM)} />
                    <ActivitiesLink onClick={this.toggleShowActivities}>Show activities</ActivitiesLink>
                    <AthleteTable
                        athletes={this.props.athletes}
                        sport={this.props.sport}
                        targetDistance={this.props.targetDistance}
                        toggleAth={this.props.toggleAth}
                        toggleAllAth={this.props.toggleAllAth} />
                    <h3>Want to join in? Join the <Link href='https://www.strava.com/clubs/175865'>Nucleus Club</Link>,
                        and then please <Link href='/auth'>authenticate</Link></h3>
                </div>}
                {!this.state.hidden && this.state.showActivities && <Activities>
                    <Link onClick={this.toggleShowActivities}>Hide activities</Link>
                    <IFrame
                        allowtransparency
                        frameborder='0'
                        height='454'
                        scrolling='no'
                        src='https://www.strava.com/clubs/175865/latest-rides/251984fccea70cd1338d0e829b58db5881600727?show_rides=true'
                        width='300'></IFrame>
                </Activities>}
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

const IFrame = styled.iframe`
    width: 100%;
    border: none;
    margin-top: 30px;
`;

const Activities = styled.div`
    margin-top: 50px;
`;

const ActivitiesLink = Link.extend`
    margin-left: 15px;
`;

const HideDiv = styled.div`
    float: right;
    font-size: 40px;
    cursor: pointer;
`;

Sidebar.propTypes = {
    athletes: PropTypes.objectOf(PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        stats: PropTypes.shape({
            ytd_run_totals: PropTypes.shape({
                distance: PropTypes.number
            })
        }),
        selected: PropTypes.bool
    })),
    changeSport: PropTypes.func,
    sport: PropTypes.string,
    targetDistance: PropTypes.number,
    toggleAth: PropTypes.func,
    toggleAllAth: PropTypes.func
};
