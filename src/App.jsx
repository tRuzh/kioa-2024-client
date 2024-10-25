import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddPerson from "./components/add-person.component";
import Person from "./components/person.component";
import PeopleList from "./components/people-list.component";

class App extends Component {
  render() {
    return (
      <Router>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/people"} className="navbar-brand">
            muākimua
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/people"} className="nav-link">
                People
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/people"]} component={PeopleList} />
            <Route exact path="/add" component={AddPerson} />
            <Route path="/people/:id" component={Person} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
