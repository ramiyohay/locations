import React from 'react';
import {Divider, Header, Icon} from "semantic-ui-react";

const PageHeader = () => {
    return (
        <div>
            <div style={{height: '10px'}}/>
            <Header as='h1' icon textAlign='center'>
                <Icon name='home' circular size={'massive'} />
                <Header.Content>My Locations</Header.Content>
            </Header>
            <Divider section/>
        </div>
    )
};

export default PageHeader;
