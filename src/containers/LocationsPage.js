import React from 'react';
import {connect} from 'react-redux';
import {setUsedCategories} from '../actions/actions';
import {Button, Container, Header, Icon, Modal, Segment} from "semantic-ui-react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import MapModal from "../components/MapModal";
import LocationsModal from "../components/LocationModal";
import {find, findIndex, isEmpty, maxBy, remove} from "lodash";
import StorageService from "../services/StorageService";

export class LocationsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usedCategories: [],
            selectedLocation: null,
            locations: [],
            mapVisible: false,
            formVisible: false,
            actionsVisible: false
        };
    }

    _deleteLocation = (id) => {
        const locations = isEmpty(this.state.locations) ? StorageService.getLocations() : this.state.locations.slice();
        const categoriesToSearch = find(locations, {id}).categories;
        const allCategories = StorageService.getCategories();
        const categoriesToRemove = [];

        remove(locations, {id});
        this.setState({actionsVisible: false, selectedLocation: null});
        this._updateLocations(locations);

        categoriesToSearch.forEach((catName) => {
            let foundCategoryRef = false;

            locations.forEach((loc) => {
                if (loc.categories.includes(catName)) {
                    foundCategoryRef = true;
                }
            });

            if (!foundCategoryRef) {
                const id = find(allCategories, {value: catName}).id;
                categoriesToRemove.push(id);
            }
        });

        if (!isEmpty(categoriesToRemove)) {
            const usedCategories = this.props.usedCategories.slice();
            categoriesToRemove.forEach((catId) => {
                remove(usedCategories, function (n) {
                    return n === catId;
                });
            });

            this.props.setUsedCategories(usedCategories);
        }
    };

    _updateLocations = (updatedLocations) => {
        StorageService.saveLocations(updatedLocations);
        this.setState({locations: updatedLocations});
    };

    _onModalConfirm = (location) => {
        if (isEmpty(location)) return;

        const allCategories = StorageService.getCategories();
        const usedCategories = this.props.usedCategories.slice();
        const locations = isEmpty(this.state.locations) ? StorageService.getLocations() : this.state.locations.slice();

        if (location.hasOwnProperty('id')) { // updated location
            const index = findIndex(locations, {id: location.id});
            locations.splice(index, 1, location);
        } else { // new location
            const loc = find(locations, {value: location.name}); // verify that we are adding not existing location name
            if (loc) return; // location name already exist, no need to add

            location.id = isEmpty(locations) ? 1 : maxBy(locations, 'id').id + 1;
            locations.push(location);
        }

        location.categories.forEach((catName) => {
            const category = find(allCategories, {value: catName});

            if (category) {
                if (usedCategories.indexOf(category.id) === -1) usedCategories.push(category.id);
            }
        });

        this.props.setUsedCategories(usedCategories);
        this.setState({usedCategories});
        this._updateLocations(locations);
    };

    render() {
        const me = this;
        const locationsList = isEmpty(this.state.locations) ? StorageService.getLocations() : this.state.locations;
        const columns = [{
            Header: 'Name',
            accessor: 'name' // String-based value accessors!
        }, {
            Header: 'Address',
            accessor: 'address'
        }, {
            id: 'coordinates', // Required because our accessor is not a string
            Header: 'Coordinates',
            Cell: props => {
                return <span
                    className='string'>{props.row._original.coordinates.lat} ,{props.row._original.coordinates.lang}</span>
            }
        }, {
            id: 'categories',
            Header: 'Categories',
            Cell: props => {
                return <span className='string'>{props.original.categories.join(',')}</span>
            },
            filterMethod: (filter, row) => {
                if (filter.value === "all") {
                    return true;
                } else {
                    return row._original[filter.id].indexOf(filter.value) > -1;
                }
            },
            Filter: ({filter, onChange}) => {
                const _createSelectCategories = () => {
                    const items = [];

                    items.push(<option key="-1" value="all">All Categories</option>);

                    StorageService.getCategories().forEach((cat) => {
                        items.push(<option key={cat.id} value={cat.value}>{cat.value}</option>)
                    });

                    return items;
                };

                return (
                    <select onChange={event => onChange(event.target.value)}
                            style={{width: "100%"}}
                            value={filter ? filter.value : "all"}>
                        {_createSelectCategories()}
                    </select>
                )
            }
        }
        ];

        return (
            <main>
                <Container textAlign='left'>
                    <Button animated='fade' onClick={() => this.setState({formVisible: true})}>
                        <Button.Content visible>Add New Location</Button.Content>
                        <Button.Content hidden>
                            <Icon name='plus'/>
                        </Button.Content>
                    </Button>
                    <Header as={'h2'} content={'Locations'}/>
                    <ReactTable
                        data={locationsList}
                        columns={columns}
                        defaultPageSize={10}
                        minRows={0}
                        noDataText={'No Locations Yet...'}
                        pageSizeOptions={[5, 10]}
                        filterable
                        className="-striped -highlight"
                        style={{
                            maxHeight: '350px'
                        }}
                        getTrProps={(state, rowInfo, column) => {
                            return {
                                onClick: (e, handleOriginal) => {
                                    me.setState({actionsVisible: true, selectedLocation: rowInfo.row._original});
                                },
                                style: {
                                    textAlign: 'center',
                                    cursor: 'pointer'
                                }
                            }
                        }}
                    />
                </Container>

                {this.state.selectedLocation &&
                <Modal open={this.state.actionsVisible} size={'large'}
                       onClose={() => me.setState({actionsVisible: false, selectedLocation: null})}>
                    <Modal.Header content={`Location: ${this.state.selectedLocation.name}`}/>
                    <Modal.Content>
                        <Segment basic textAlign={'center'}>
                            <Button.Group>
                                <Button content='Edit/View Location' icon='pencil' labelPosition='left'
                                        size={'massive'}
                                        onClick={() => me.setState({formVisible: true})}/>
                                <Button.Or/>
                                <Button content='Delete Location' icon='delete' labelPosition='left'
                                        size={'massive'}
                                        onClick={this._deleteLocation.bind(this, this.state.selectedLocation.id)}/>
                                <Button.Or/>
                                <Button content='View On GoogleMaps(c)' icon='marker' labelPosition='left'
                                        size={'massive'}
                                        onClick={() => me.setState({mapVisible: true})}/>
                            </Button.Group>
                        </Segment>
                    </Modal.Content>
                </Modal>
                }

                <LocationsModal open={this.state.formVisible}
                                onClose={() => me.setState({formVisible: false, selectedLocation: null})}
                                onConfirm={this._onModalConfirm}
                                locations={this.state.locations}
                                location={this.state.selectedLocation}/>


                {this.state.selectedLocation &&
                <MapModal open={this.state.mapVisible} location={this.state.selectedLocation}
                          onClose={() => me.setState({mapVisible: false})}/>
                }
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usedCategories: state.usedCategories
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUsedCategories: (payload) => dispatch(setUsedCategories(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationsPage);
