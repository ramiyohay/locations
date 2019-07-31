import React from 'react';
import {Container, Header, Icon, Modal} from "semantic-ui-react";
import GoogleMapReact from "google-map-react";
import {API_KEY} from "../services/Constants";

const MapModal = ({open, onClose, location, ...props}) => {
    const Marker = () => <Icon name={'marker'} color={'red'} size={'huge'}/>;

    return (
        <Modal open={open} basic size='small' onClose={onClose}>
            <Header icon='marker'
                    content={`${location.address} (${location.name})`}/>
            <Modal.Content>
                <Container style={{width: '100%', height: '400px'}}>
                    <GoogleMapReact
                        defaultCenter={{
                            lat: parseFloat(location.coordinates.lat),
                            lng: parseFloat(location.coordinates.lang)
                        }}
                        defaultZoom={17}
                        bootstrapURLKeys={{key: API_KEY}}>
                        <Marker lat={parseFloat(location.coordinates.lat)} lng={parseFloat(location.coordinates.lang)}/>
                    </GoogleMapReact>
                </Container>
            </Modal.Content>
        </Modal>
    )
};

export default MapModal;
