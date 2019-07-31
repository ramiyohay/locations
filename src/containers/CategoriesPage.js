import React from 'react';
import {Button, Container, Header, Icon, List, Modal, Segment} from "semantic-ui-react";
import {find, findIndex, isEmpty, maxBy, remove} from 'lodash';
import {connect} from 'react-redux';
import CategoryModal from "../components/CategoryModal";
import StorageService from "../services/StorageService";

export class CategoriesPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {categories: [], categoriesList: null, selectedCategory: null, visible: false, error: false};
    }

    _updateCategories = (updatedCategories) => {
        const me = this;

        this.setState({
            categories: updatedCategories
        }, function () {
            StorageService.saveCategories(this.state.categories);

            const categoriesList = this.state.categories.map((cat) => me._buildCategoryItem(cat));
            this.setState({categoriesList});
        });
    };

    _deleteCategory = (id) => {
    debugger;
        const categories = isEmpty(this.state.categories) ? StorageService.getCategories() : this.state.categories.slice();
        const usedCategories = this.props.usedCategories;
        const refToCategoryExists = usedCategories.includes(id);

        if (refToCategoryExists) {
            this.setState({error: true});
        } else {
            remove(categories, {id});
            this._updateCategories(categories);
        }
    };

    _editCategory = (id) => {
        const categories = isEmpty(this.state.categories) ? StorageService.getCategories() : this.state.categories.slice();
        const cat = find(categories, {id});

        if (cat) this.setState({visible: true, selectedCategory: cat});
    };

    _buildCategoryItem = (cat) => {
        return (
            <List.Item key={cat.id}>
                <List.Content floated='right'>
                    <Button positive onClick={this._editCategory.bind(this, cat.id)}>Edit</Button>
                    <Button negative onClick={this._deleteCategory.bind(this, cat.id)}>Delete</Button>
                </List.Content>
                <Icon name={'tag'}/>
                <List.Content><b>{cat.value}</b></List.Content>
            </List.Item>
        )
    };

    _onModalConfirm = (category) => {
        if (isEmpty(category)) return;

        const categories = isEmpty(this.state.categories) ? StorageService.getCategories() : this.state.categories.slice();

        if (typeof category === 'object') { // if category is an object , we are updating a category
            const index = findIndex(categories, {id: category.id});
            categories.splice(index, 1, {id: category.id, value: category.value});
        } else { // adding new category
            const cat = find(categories, {value: category}); // verify that we are adding not existing category name
            if (cat) return; // category name already exist, no need to add

            const id = isEmpty(categories) ? 0 : maxBy(categories, 'id').id;
            categories.push({id: id + 1, value: category});
        }

        this._updateCategories(categories);
    };

    render() {
        let categoriesList;

        if (this.state.categoriesList) {
            categoriesList = this.state.categoriesList;
        } else {
            categoriesList = StorageService.getCategories().map((cat) => this._buildCategoryItem(cat));
        }

        return (
            <main>
                <Container textAlign='left'>
                    <Segment style={{maxHeight:'400px',overflow:'auto'}}>
                        <Button animated='fade' onClick={() => this.setState({visible: true})}>
                            <Button.Content visible>Add New Category</Button.Content>
                            <Button.Content hidden>
                                <Icon name='plus'/>
                            </Button.Content>
                        </Button>
                        <Header as={'h2'} content={'Categories'}/>
                        <List animated divided verticalAlign='middle'>
                            {categoriesList}
                        </List>
                    </Segment>
                </Container>

                <Modal open={this.state.error} basic size='small'>
                    <Header icon='delete' content='Delete Category Error'/>
                    <Modal.Content>
                        <p>
                            The selected category cannot be deleted as it is referenced in one or more locations.
                            <br/>
                            Please remove all the category references before deleting
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={() => this.setState({error: false})}>
                            <Icon name='checkmark'/> OK
                        </Button>
                    </Modal.Actions>
                </Modal>

                <CategoryModal open={this.state.visible}
                               onClose={() => this.setState({visible: false, selectedCategory: null})}
                               onConfirm={this._onModalConfirm}
                               category={this.state.selectedCategory}
                />
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usedCategories: state.usedCategories
    };
};

export default connect(mapStateToProps)(CategoriesPage);


