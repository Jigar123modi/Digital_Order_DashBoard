import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from './components/Dashboard';
import Login from './components/Login/';
import { PrivateRoute, LoginRoute } from './components/routes/routes';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <LoginRoute path="/login" component={Login} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
