import React, { Component } from 'react';
import get from 'lodash/get';
import styled from 'styled-components';

import Link from './Link';

export default class AthleteTable extends Component {

    getRows = () => {
        return Object.values(this.props.athletes)
            .sort((a, b) => get(b, 'stats.ytd_run_totals.distance', 0) - get(a, 'stats.ytd_run_totals.distance', 0))
            .map((ath, idx) => {
                let runnerDistance = get(ath, 'stats.ytd_run_totals.distance', 0) / 1000;
                return <tr key={idx}>
                    <td><Link href={`https://www.strava.com/athletes/${ath.id}`}>{`${ath.firstname} ${ath.lastname}`}</Link></td>
                    <NumberTD>{runnerDistance.toFixed(2)}km</NumberTD>
                    <NumberTD>{(runnerDistance / this.props.targetDistance * 100).toFixed(2)}%</NumberTD>
                </tr>
            });
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