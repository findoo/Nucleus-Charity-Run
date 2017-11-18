import React, { PureComponent } from 'react';

export default class Polyline extends PureComponent {

    componentWillUpdate() {
        this.line.setMap(null);
    }

    componentWillUnmount() {
        this.line.setMap(null);
    }

    getPaths() {
        const { origin, destination } = this.props;
        return [
            { lat: Number(origin.lat), lng: Number(origin.lng) },
            { lat: Number(destination.lat), lng: Number(destination.lng) }
        ];
    }

    render() {
        const Polyline = this.props.maps.Polyline
        const renderedPolyline = {
            geodesic: true,
            strokeColor: this.props.color || '#f69630',
            strokeOpacity: 1,
            strokeWeight: 5
        };
        const paths = { path: this.getPaths() };
        this.line = new Polyline(Object.assign({}, renderedPolyline, paths));
        this.line.setMap(this.props.map);
        return null;
    }

}