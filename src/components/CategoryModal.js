import React from 'react';
import {Button, Form, Modal} from 'semantic-ui-react';

const CategoryModal = ({open, onClose, onConfirm, category, ...props}) => {
    let text;

    const _addCategory = () => {
        onConfirm(text);
        onClose();
    };

    const _updateCategory = () => {
        category.value = text;

        onConfirm(category);
        onClose();
    };

    return (
        <Modal open={open} closeIcon onClose={onClose} closeOnDimmerClick={false} size={'tiny'}>
            <Modal.Header>{category ? 'Edit Category' : 'Add New Category'}</Modal.Header>
            <Modal.Content>
                <Form>
                    <Form.Input placeholder={'Enter Category...'} onChange={(e, data) => text = data.value}
                                defaultValue={category ? category.value : ''}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={category ? _updateCategory : _addCategory}
                    color={'blue'}
                    icon={category ? 'pencil' : 'plus'}
                    labelPosition="left"
                    content={category ? 'Update' : 'Add'}
                />
            </Modal.Actions>
        </Modal>
    );
};

export default CategoryModal;
