import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Polyline, withScriptjs } from "react-google-maps";
import { Marker, InfoWindow } from "react-google-maps";
import iconStop from '../../images/stop-icon.png';


class Harta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoIndex: -1
        }
    }

    handleToggleOpen = (index) => {
        this.setState({
            infoIndex: index
        });

    }

    handleToggleClose = () => {
        this.setState({
            infoIndex: -1
        });

    }

    getTraseu() {
        let traseu = [];
        let traseuData = this.props.traseu.split('#');

        var loc, position;
        for (var i = 0; i < traseuData.length - 1; i++) {
            loc = traseuData[i].split(',');
            if (loc[0].length > 0) {
                position = { lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) };
                traseu.push(position);
            }
        }

        return traseu;
    }


    getOpriri() {

        if (this.props.opriri === '')
            return;

        let locations = this.props.opriri.split('!');

        let places = locations.map((locations, i) => {
            let onePlace = locations.split('-');
            return (
                <Marker
                    key={i}
                    position={{ lat: parseFloat(onePlace[2]), lng: parseFloat(onePlace[3]) }}
                    onClick={() => this.handleToggleOpen(i)}
                    icon={{
                        url: iconStop
                    }}
                >
                    {
                        (this.state.infoIndex === i) &&
                        <InfoWindow onCloseClick={() => this.handleToggleClose()}>
                            <span><b>{onePlace[0]}</b><br />{onePlace[1]}</span>
                        </InfoWindow>
                    }
                </Marker>
            )
        });

        return places;
    }


 


    render() {
        let traseuPath = this.getTraseu();

        return (
            <GoogleMap defaultZoom={8} center={{ lat: this.props.centerLat, lng: this.props.centerLon }}>
                <Polyline
                    geodesic={true}
                    strokeColor={'#FF0000'}
                    strokeOpacity={1.0}
                    strokeWeight={2}
                    path={traseuPath}
                />
                {this.getOpriri()}
            </GoogleMap>
        )
    }
}

export default withScriptjs(withGoogleMap(Harta));