import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import styled from 'styled-components';

import Link from './Link';

export default class AthleteTable extends Component {

    getRows = () => {
        return Object.values(this.props.athletes)
            .filter(ath => get(ath, `stats.ytd_${this.props.sport}_totals.distance`, 0) !== 0)
            .sort((a, b) => get(b, `stats.ytd_${this.props.sport}_totals.distance`, 0) - get(a, `stats.ytd_${this.props.sport}_totals.distance`, 0))
            .map((ath, idx) => {
                let runnerDistance = get(ath, `stats.ytd_${this.props.sport}_totals.distance`, 0) / 1000;
                return <Row isPacer={ath.firstname === 'Pacer'}  key={idx}>
                    <td><Link href={`https://www.strava.com/athletes/${ath.id}`}>{`${ath.firstname} ${ath.lastname}`}</Link></td>
                    <NumberTD>{runnerDistance.toFixed(2)}km</NumberTD>
                    <NumberTD>{(runnerDistance / this.props.targetDistance * 100).toFixed(2)}%</NumberTD>
                </Row>
            });
    }

    getTotalRow = () => {
        let distance = Object.values(this.props.athletes)
            .filter(ath => ath.firstname !== 'Pacer')
            .reduce((a, b) => a + get(b, `stats.ytd_${this.props.sport}_totals.distance`, 0), 0) / 1000;
        return <TotalRow key='total'>
            <td>Total (ex. Pacer)</td>
            <NumberTD>{distance.toFixed(2)}km</NumberTD>
            <NumberTD>{(distance / this.props.targetDistance * 100).toFixed(2)}%</NumberTD>
        </TotalRow>;
    }

    render() {
        return <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <NumberTH>Distance</NumberTH>
                    <NumberTH>% complete</NumberTH>
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

const NumberTH = styled.th`
    text-align: right;
`;

const TotalRow = styled.tr`
    font-weight: bold;
`;

const Row = styled.tr`
    ${props => props.isPacer ? 'border-bottom: 1px solid red;' : ''}
`;

AthleteTable.PropTypes = {
    athletes: PropTypes.objectOf(PropTypes.shape({
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        stats: PropTypes.shape({
            ytd_run_totals: PropTypes.shape({
                distance: PropTypes.number
            })
        })
    })),
    targetDistance: PropTypes.number
};
