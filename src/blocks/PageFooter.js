import React from 'react';
import {Button, Divider, Popup, Segment} from "semantic-ui-react";
import { withRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

export class PageFooter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    _gotoLocations = () =>{
        this.props.history.push('/locations');
    };

    _gotoCategories = () =>{
        this.props.history.push('/categories');
    };

    render() {
        return (
            <div>
                <Divider section/>
                <Segment basic>
                    <Popup
                        trigger={<Button circular icon='location arrow' size={'massive'} onClick={this._gotoLocations}/>}
                        content='Goto Locations Page'
                        inverted
                    />

                    <Popup
                        trigger={<Button circular icon='tag' size={'massive'} onClick={this._gotoCategories}/>}
                        content='Goto Categories Page'
                        inverted
                    />
                </Segment>
            </div>
        )
    }
}

export default withRouter(PageFooter); // we use withRouter in order to enable this.props.history
