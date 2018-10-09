import React from 'react';
import { shallow } from 'enzyme';

import AthleteTable, { Row, NumberTD, TotalRow } from './AthleteTable';
import Link from './Link';

const ATHLETE_1 = {
    firstname: 'Eric',
    lastname: 'Vincent',
    stats: {
        ytd_running_totals: { distance: 20000, moving_time: 5000 }
    }
};

const ATHLETE_2 = {
    firstname: 'Finlay',
    lastname: 'Smith',
    stats: {
        ytd_running_totals: { distance: 10000, moving_time: 1000 }
    }
};

describe('AthleteTable', () => {

    it('creates a row for each athlete', () => {
        const wrapper = shallow(<AthleteTable
            sport='running'
            athletes={{ ATHLETE_1, ATHLETE_2 }}
            toggleAth={() => { }}
            targetDistance={100} />);

        const rows = wrapper.find(Row);
        expect(rows).to.have.lengthOf(2);
        expect(rows.at(0).find(Link).dive().text()).to.equal('Eric Vincent');
        expect(rows.at(0).find(NumberTD).at(0).dive().text()).to.equal('20.00km');
        expect(rows.at(0).find(NumberTD).at(1).dive().text()).to.equal('4:10/km');
        expect(rows.at(0).find(NumberTD).at(2).dive().text()).to.equal('20.00%');

        expect(rows.at(1).find(Link).dive().text()).to.equal('Finlay Smith');
        expect(rows.at(1).find(NumberTD).at(0).dive().text()).to.equal('10.00km');
        expect(rows.at(1).find(NumberTD).at(1).dive().text()).to.equal('1:40/km');
        expect(rows.at(1).find(NumberTD).at(2).dive().text()).to.equal('10.00%');
    });

    it('creates a total row', () => {
        const wrapper = shallow(<AthleteTable
            sport='running'
            athletes={{ ATHLETE_1, ATHLETE_2 }}
            toggleAth={() => { }}
            targetDistance={100} />);
        const totalRow = wrapper.find(TotalRow);
        expect(totalRow.find(NumberTD).at(0).dive().text()).to.equal('30.00km');
        expect(totalRow.find(NumberTD).at(1).dive().text()).to.equal('3:20/km');
        expect(totalRow.find(NumberTD).at(2).dive().text()).to.equal('30.00%');

    });

    it('shows medals for top three athletes above 100%', () => {
        const wrapper = shallow(<AthleteTable
            sport='running'
            athletes={{ ATHLETE_1, ATHLETE_2, Ath3: ATHLETE_1 }}
            toggleAth={() => { }}
            targetDistance={1} />);

        const rows = wrapper.find(Row);
        expect(rows.at(0).find(Link).dive().text()).contains('🥇');
        expect(rows.at(1).find(Link).dive().text()).contains('🥈');
        expect(rows.at(2).find(Link).dive().text()).contains('🥉');
    });

});