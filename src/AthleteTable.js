import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';
import moment from 'moment';

import Link from './Link';

export default class AthleteTable extends Component {

    getRows = () => {
        return Object.values(this.props.athletes)
            .filter(ath => get(ath, `stats.ytd_${this.props.sport}_totals.distance`, 0) !== 0)
            .sort((a, b) => get(b, `stats.ytd_${this.props.sport}_totals.distance`, 0) - get(a, `stats.ytd_${this.props.sport}_totals.distance`, 0))
            .map((ath, idx) => {
                let runnerDistance = get(ath, `stats.ytd_${this.props.sport}_totals.distance`, 0) / 1000;
                let averageSpeed =  moment().startOf('day').add(get(ath, `stats.ytd_${this.props.sport}_totals.moving_time`, 0) / 60 / runnerDistance, 'minutes');
                let percentage = runnerDistance / this.props.targetDistance * 100;
                return <Row isPacer={ath.firstname === 'Pacer'} key={idx}>
                    <td><input type='checkbox' checked={ath.selected} value={ath.selected} onChange={this.props.toggleAth.bind(null, ath.id)} /></td>
                    <td><Link href={`https://www.strava.com/athletes/${ath.id}`}>{`${ath.firstname} ${ath.lastname}${this.getEmoji(percentage, idx)}`}</Link></td>
                    <NumberTD>{runnerDistance.toFixed(2)}km</NumberTD>
                    <NumberTD>{averageSpeed.format('m:ss')}/km</NumberTD>
                    <NumberTD>{percentage.toFixed(2)}%</NumberTD>
                </Row>;
           });
    }

    getEmoji = (percentage, idx) => {
        if (percentage > 100) {
            if (idx === 0) {
                return '🥇';
            }
            if (idx === 1) {
                return '🥈';
            }
            if (idx === 2) {
                return '🥉';
            }
        }
        return '';
    }

    getTotalRow = () => {
        let distance = Object.values(this.props.athletes)
            .filter(ath => ath.firstname !== 'Pacer')
            .reduce((a, b) => a + get(b, `stats.ytd_${this.props.sport}_totals.distance`, 0), 0) / 1000;
        let averageSpeed = moment().startOf('day').add(Object.values(this.props.athletes)
            .filter(ath => ath.firstname !== 'Pacer')
            .reduce((a, b) => a + get(b, `stats.ytd_${this.props.sport}_totals.moving_time`, 0), 0) / 60 / distance, 'minutes');
        return <TotalRow key='total'>
            <td></td>
            <td>Total (ex. Pacer)</td>
            <NumberTD>{distance.toFixed(2)}km</NumberTD>
            <NumberTD>{averageSpeed.format('m:ss')}/km</NumberTD>
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
                    <Th align='right'>Average pace</Th>
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

const Th = styled.th`
    ${props => props.width ? `width: ${props.width}` : ''}
    text-align: ${props => props.align || 'left'}
`;


export const NumberTD = styled.td`
    text-align: right;
`;

export const Row = styled.tr`
    ${props => props.isPacer ? 'border-bottom: 1px solid red;' : ''}
`;

export const TotalRow = styled.tr`
    font-weight: bold;
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
