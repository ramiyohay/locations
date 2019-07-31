import React from 'react';
import {Button, Form, Message, Modal} from 'semantic-ui-react';
import {cloneDeep, isEmpty, some} from 'lodash';
import StorageService from "../services/StorageService";

export class LocationsModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {errorList: []};
        this.locationObj = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.open) return; // no need for logic if the modal is closed

        const location = this.props.location;
        const initialData = {
            name: '',
            address: '',
            coordinates: {lat: 0, lang: 0},
            categories: []
        };

        if (this.locationObj.init) return;

        if (isEmpty(location)) {
            this.locationObj = initialData;
            this.locationObj.init = true;
        } else {
            this.locationObj = cloneDeep(location);
            this.locationObj.init = true;
        }
    }

    _handleInput = (e, data) => {
        if (data.id === 'lat' || data.id === 'lang') {
            this.locationObj.coordinates[data.id] = data.value.trim();
        } else if (data.id === 'categories') {
            this.locationObj[data.id] = data.value; // data.value is an array
        } else {
            this.locationObj[data.id] = data.value.trim();
        }
    };

    _validate = () => {
        const errorList = [];
        const noName = isEmpty(this.locationObj.name);
        const nameExists = !noName && some(this.props.locations, {name: this.locationObj.name.toLowerCase().trim()});
        const noAddress = isEmpty(this.locationObj.address);
        const noLAT = isEmpty(this.locationObj.coordinates.lat);
        const noLANG = isEmpty(this.locationObj.coordinates.lang);
        const noCategories = isEmpty(this.locationObj.categories);
        const nanLAT = isNaN(this.locationObj.coordinates.lat);
        const nanLANG = isNaN(this.locationObj.coordinates.lang);

        if (noName) errorList.push('Location name is empty');
        if (nameExists) errorList.push('Location name already exists');
        if (noAddress) errorList.push('Location address is empty');
        if (noLAT) errorList.push('Location latitude is empty');
        if (noLANG) errorList.push('Location longitude is empty');
        if (noCategories) errorList.push('Location categories must contain at least one category');
        if (nanLAT) errorList.push('Location latitude is invalid');
        if (nanLANG) errorList.push('Location longitude is invalid');

        this.setState({errorList});

        return isEmpty(errorList);
    };

    _addLocation = () => {
        const valid = this._validate();

        if (valid) {
            this.props.onConfirm(this.locationObj);
            this._close();
        }
    };

    _updateLocation = () => {
        const valid = this._validate();

        if (valid) {
            this.props.onConfirm(this.locationObj);
            this._close();
        }
    };

    _close = () => {
        this.setState({errorList: []});
        this.props.onClose();
        this.locationObj = {};
    };

    render() {
        const location = this.props.location;
        const categories = StorageService.getCategories().map((cat) => {
            return {
                key: cat.id,
                text: cat.value,
                value: cat.value
            };
        });

        return (
            <Modal open={this.props.open} closeIcon onClose={this._close} closeOnDimmerClick={false}>
                <Modal.Header>{location ? `Edit Location - ${location.name}` : 'Add New Location'}</Modal.Header>
                <Modal.Content>
                    <Form className="attached fluid" error={!isEmpty(this.state.errorList)}>
                        <Message error list={this.state.errorList} floating header={'Please review the errors'}/>
                        <Form.Group widths="equal">
                            <Form.Input fluid label={'Location Name'} placeholder={'Location Name'} id={'name'}
                                        onChange={this._handleInput.bind(this)}
                                        defaultValue={location ? location.name : ''}
                                        required
                            />
                            <Form.Input fluid label={'Location Address'} placeholder={'Location Address'} id={'address'}
                                        onChange={this._handleInput.bind(this)}
                                        defaultValue={location ? location.address : ''}
                                        required
                            />
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Input fluid label={'Location Latitude'} placeholder={'Location Latitude'} id={'lat'}
                                        onChange={this._handleInput.bind(this)}
                                        defaultValue={location ? location.coordinates.lat : ''}
                                        required
                            />
                            <Form.Input fluid label={'Location Longitude'} placeholder={'Location Longitude'}
                                        id={'lang'}
                                        onChange={this._handleInput.bind(this)}
                                        defaultValue={location ? location.coordinates.lang : ''}
                                        required
                            />
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Dropdown id={'categories'}
                                           label={'Categories'}
                                           onChange={this._handleInput.bind(this)}
                                           selection
                                           fluid
                                           search
                                           multiple
                                           defaultValue={location ? location.categories : []}
                                           options={categories}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={location ? this._updateLocation : this._addLocation}
                        color={'blue'}
                        icon={location ? 'pencil' : 'plus'}
                        labelPosition="left"
                        content={location ? 'Update' : 'Add'}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

export default LocationsModal;
