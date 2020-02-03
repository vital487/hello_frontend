import React from 'react';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import InitialScreen from './InitialScreen';
import ChatScreen from './ChatScreen';

class App extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/" exact component={InitialScreen} />
                        <Route path="/chat" component={ChatScreen} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;