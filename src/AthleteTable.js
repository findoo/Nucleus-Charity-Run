import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import moment from 'moment';

import Link from './Link';

export default class AthleteTable extends Component {

    formatDecimalPace = pace => `${moment().startOf('day').add(pace, 'minutes').format('m:ss')}/km`;

    getDistance = ath => get(ath, `stats.ytd_${this.props.sport}_totals.distance`, 0) / 1000;

    getPace = (ath, distance) => get(ath, `stats.ytd_${this.props.sport}_totals.moving_time`, 0) / 60 / distance;

    getRows = () => {
        return Object.values(this.props.athletes)
            .filter(ath => this.getDistance(ath) !== 0)
            .sort((a, b) => this.getDistance(b) - this.getDistance(a))
            .map((ath, idx) => {
                const runnerDistance = this.getDistance(ath);
                const averagePaceDecimal = this.getPace(ath, runnerDistance);
                return <Row isPacer={ath.firstname === 'Pacer'} key={idx}>
                    <td><input type='checkbox' checked={ath.selected} value={ath.selected} onChange={this.props.toggleAth.bind(null, ath.id)} /></td>
                    <td><Link href={`https://www.strava.com/athletes/${ath.id}`}>{`${ath.firstname} ${ath.lastname}`}</Link></td>
                    <NumberTD>{runnerDistance.toFixed(2)}km</NumberTD>
                    <NumberTD>{this.formatDecimalPace(averagePaceDecimal)}</NumberTD>
                    <NumberTD>{(runnerDistance / this.props.targetDistance * 100).toFixed(2)}%</NumberTD>
                </Row>
            });
    }

    getTotalRow = () => {
        const athletesExcludingPacer = Object.values(this.props.athletes)
            .filter(ath => ath.firstname !== 'Pacer');
        const distance = athletesExcludingPacer
            .reduce((a, b) => a + this.getDistance(b), 0);
        const averagePaceDecimal = athletesExcludingPacer
            .reduce((a, b) => a + get(b, `stats.ytd_${this.props.sport}_totals.moving_time`, 0), 0) / 60 / distance;
        return <TotalRow key='total'>
            <td></td>
            <td>Total (ex. Pacer)</td>
            <NumberTD>{distance.toFixed(2)}km</NumberTD>
            <NumberTD>{this.formatDecimalPace(averagePaceDecimal)}</NumberTD>
            <NumberTD>{(distance / this.props.targetDistance * 100).toFixed(2)}%</NumberTD>
        </TotalRow>;
    }

    render() {
        let selectAllChecked = !Object.values(this.props.athletes).some(ath => !ath.selected);
        return <Table>
            <thead>
                <tr>
                    <Th width='30px'>
                        <input type='checkbox' checked={selectAllChecked} value={selectAllChecked} onChange={this.props.toggleAllAth} />
                    </Th>
                    <Th>Name</Th>
                    <Th align='right'>Distance</Th>
                    <Th align='right'>Average Pace</Th>
                    <Th align='right'>% complete</Th>
                </tr>
            </thead>
            <tbody>
                {this.getRows()}
                {this.getTotalRow()}
            </tbody>
        </Table>;
    }
}

const Table = styled.table`
    margin-top: 40px;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 0;

    td {
        letter-spacing: 1px;
        padding: 6px;
    }
`;

const NumberTD = styled.td`
    text-align: right;
`;

const Th = styled.th`
    ${props => props.width ? `width: ${props.width}` : ''}
    text-align: ${props => props.align || 'left'}
`;

const TotalRow = styled.tr`
    font-weight: bold;
`;

const Row = styled.tr`
    ${props => props.isPacer ? 'border-bottom: 1px solid red;' : ''}
`;

AthleteTable.propTypes = {
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
    sport: PropTypes.string,
    targetDistance: PropTypes.number,
    toggleAth: PropTypes.func,
    toggleAllAth: PropTypes.func
};
