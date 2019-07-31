import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import PageHeader from "./blocks/PageHeader";
import PageFooter from "./blocks/PageFooter";
import LocationsPage from "./containers/LocationsPage";
import CategoriesPage from "./containers/CategoriesPage";
import NotFoundPage from "./containers/NotFoundPage";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <PageHeader/>
                    <main>
                        <Switch>
                            <Route exact path="/" render={() => (<Redirect to="/locations"/>)}/>
                            <Route exact path="/locations" component={LocationsPage}/>
                            <Route exact path="/categories" component={CategoriesPage}/>
                            <Route path="" component={NotFoundPage}/>
                        </Switch>
                    </main>
                    <PageFooter/>
                </div>
            </Router>
        </div>
    );
}

export default App;
