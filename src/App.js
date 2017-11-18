import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import polyline from '@mapbox/polyline';
import get from 'lodash/get';

import AthleteTable from './AthleteTable';
import Polyline from './Polyline';
import Marker from './Marker';

const lines = polyline.decode('gqqpHbe{a@q{FioZc{GcdSstDe~FgcFkyTatN}ve@eoMsm]cnBugFywEoqRe{B}tVajIszBacFqgMgoGcsLsoF}jTe|CsbVafHej[cyE}b\\mpBwzCmuGy_PqkFwpHkmEedO_i@edGaqB}`JeaAc_SelAi|Rs{FmnXcdFgjZasHg`WiyCksGesEexBknCwdCo}E__@swGde@wlDuaCcaGe}H}sAiwIabB}gFywF~l@gfFs{DezB}uDekE_hMelFolAynC~gAsaBeeBcg@|n@{oHskEmsH{jHggF~zLofFfcD{`DrGslGny@wqLyhAsdSlmCq_Sqw@eoJk]ylLz_@mqGqq@_aGfu@srC_eAguEs}AehFlfAakF~RmjCbfDcjJr_BalC|_BcdEerAefGpxEojMexC{zIa}@ysHyu@seNxMkmIkqDq|JumGqdG{KyjHjw@y`Hg`CghPyQ_}VmyMeeDpYm{Cmy@c~I{ZusIfmB}}G~Eer@uScmG~R{~CxjDg|IveHq~IlAajLfgBiyb@`qOcpZbeC}rKg~@usEc_GgyMx{A{vL{fC_tN_kAq}EsnDcrIoxBseFwx@kmInlBmyOxvGerTr`K{{SpaPcqG|yIksDxkCqnLfxSekDnxQopDtxRkiFn}KebE~qEwwL~~GmeHb@qhHznEeiDzK{sDniBexHhsDocD~fAclCcUqkGqgFckE{hIu~EcaA}vFfn@ctHh{CesGokHokBccEirAdc@saCe[}{ElbG_hEt|AutEhtCsgAin@_aBgnBi`A`kAgo@mx@y`@NwoD~Ss}DiqAaxJpRscC_s@_eLuwE{oDxnBgkGlcDm~HrxAohEdWq~HkgGuiDlnBeeDl_DkpD|eBibNn`GkmIbyEogDnuGedDpqJkvGliAquGdsFccFfjNsmFvmB}uCxvTeeCf~W_eEfd\\g~CnuN}qDlvBc{DeeB{~KqkH_wIgqEg~DwhHyjD_fMyxL_oY{nDwcL_jHumByrDst@i}EzjH{kBp}OmlL`wQoeEd`FgaBdwF{oEidDiaAvsJcpDnpNkcBnlKyqEdbH_zAfHmxF~oAmyCtuA{kAsgBwjFq~HuyCaxF}eFcwMiiFqwPk{DccDehDhiGezF`I{mA}eE}iC{kCwlBx`CynBzHkzA_nBcdAw_LwqAcqF{gCuuPidKuxLcoEwzUwqFkaLauImrVw}FswGw`GgbKmjEosRknBoePufEeuF{tLekJglA}I{wFxaH_aHeZohCuvGefDavBmgDjaBolEcxBsFI');
const targetDistance = 1305;

class App extends Component {

    state = {
        athletes: []
    }

    componentDidMount() {
        this.initialLoad();
    }

    initialLoad = () => {
        fetch('/getAthletes')
            .then(res => res.json())
            .then(athletes => {
                athletes.forEach(ath => this.getStatForAth(ath));
                let mutated = Object.values(athletes)
                    .map(ath => ({ [ath.id]: ath }))
                    .reduce((a, b) => ({ ...a, ...b }), {});
                this.setState({ athletes: mutated })
            });
    }

    getStatForAth = (ath) => {
        fetch('/getStat/' + ath.id)
            .then(res => res.json())
            .then(stats => {
                let athletes = { ...this.state.athletes };
                athletes[ath.id].stats = stats;
                this.setState({ athletes })
            });
    }

    getMarkers = (athletes) => {
        return Object.values(athletes)
            .filter(ath => ath.stats)
            .map((ath, i) => {
                let percentage = (get(ath, 'stats.ytd_run_totals.distance', 0) / 1000 / targetDistance * 100);
                let idx = Math.floor((percentage / 100) * lines.length);
                let line = lines[idx > lines.length - 1 ? lines.length - 1 : idx];
                return <Marker key={i} lat={line[0]} lng={line[1]} text={ath.firstname} />;
            });
    }

    getLines = () => {
        return lines.map((l, idx) => <Polyline
            key={idx}
            map={this.state.map}
            maps={this.state.maps}
            origin={{ lat: l[0], lng: l[1] }}
            destination={{
                lat: lines[idx === lines.length - 1 ? idx : idx + 1][0],
                lng: lines[idx === lines.length - 1 ? idx : idx + 1][1]
            }} />);
    }

    render() {
        return (
            <Container>
                <Sidebar>
                    <h1>Nucleus Charity 2018</h1>
                    <h2>{'Lands End to John O\' Groats'}</h2>
                    <AthleteTable athletes={this.state.athletes} target={targetDistance} />
                    <h3>Want to join in? Join the <a href='https://www.strava.com/clubs/175865'>Nucleus Club</a>, and then please <a href='/auth'>authenticate</a></h3>
                </Sidebar>
                <Main>
                    <GoogleMapReact
                        onGoogleApiLoaded={({ map, maps }) => { this.setState({ map: map, maps: maps, mapLoaded: true }) }}
                        yesIWantToUseGoogleMapApiInternals
                        defaultCenter={{ lat: 54.3735819, lng: -0.1352386 }}
                        defaultZoom={6}>
                        {this.getMarkers(this.state.athletes)}
                    </GoogleMapReact>
                    {this.state.mapLoaded && this.getLines()}
                </Main>
            </Container>);
    }
}

const Container = styled.div`
    font-family: vag-rounded-light,Helvetica,Arial,sans-serif;
`;

const Sidebar = styled.div`
    height: 100%;
    background-color: #fff;
    position: fixed! important;
    z-index: 1;
    overflow: auto;
    box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    width:30%;
    right: 0;
    top: 0;
    padding: 18px
`;

const Main = styled.div`
    margin-right: 25%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`;

export default App;
