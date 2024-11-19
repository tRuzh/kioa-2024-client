// client-git/src/components/people-list.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { retrievePeople, findPeopleByFirstname } from "../actions/people";
import { Link } from "react-router-dom";
import PersonDataService from "../services/person.service";

class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchFirstname = this.onChangeSearchFirstname.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.setActivePerson = this.setActivePerson.bind(this);
    this.findByFirstname = this.findByFirstname.bind(this);
    this.showFamilyTree = this.showFamilyTree.bind(this);
    this.resetState = this.resetState.bind(this);
    this.state = {
      currentPerson: null,
      currentIndex: -1,
      searchFirstname: "",
      familyTree: {},
      loading: false,
      error: null,
      searchPerformed: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.retrievePeople()
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((e) => {
        this.setState({ loading: false, error: e.message });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.resetState();
    }
  }

  onChangeSearchFirstname(e) {
    const searchFirstname = e.target.value;
    this.setState({ searchFirstname });
  }

  refreshData() {
    this.setState({
      currentPerson: null,
      currentIndex: -1,
    });
  }

  setActivePerson(person, index) {
    this.setState({
      currentPerson: person,
      currentIndex: index,
      familyTree: {},
    });
  }

  showFamilyTree(personId) {
    console.log(`Fetching family tree for personId: ${personId}`);
    PersonDataService.getFamilyTree(personId)
      .then(response => {
        console.log("Family Tree data:", response.data);
        this.setState({
          familyTree: {
            [personId]: response.data,
          },
        });
      })
      .catch(e => {
        console.log("Error fetching family tree:", e);
        this.setState({ error: e.message });
      });
  }

  renderFamilyTree(members) {
    if (!members) return null;

    return (
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <Link to={`/people/${member.id}`}>{member.fullname}</Link>
            {member.immediaterelatives && member.immediaterelatives.length > 0 && (
              this.renderFamilyTree(member.immediaterelatives)
            )}
          </li>
        ))}
      </ul>
    );
  }

  findByFirstname() {
    this.setState({ loading: true });
    this.refreshData();
    this.props.findPeopleByFirstname(this.state.searchFirstname)
      .then(() => {
        this.setState({ loading: false, searchPerformed: true });
      })
      .catch((e) => {
        this.setState({ error: e.message, loading: false });
        console.log(e);
      });
  }

  resetState() {
    this.setState({
      currentPerson: null,
      currentIndex: -1,
      searchFirstname: "",
      familyTree: {},
      loading: false,
      error: null,
      searchPerformed: false,
    });
    this.props.retrievePeople();
  } 

  handleImmediateRelativeClick(immediateRelativeId) {
    PersonDataService.get(immediateRelativeId)
      .then((response) => {
        const person = response.data;
        const index = this.props.people.findIndex(p => p.id === person.id);
        this.setActivePerson(person, index);
      })
      .catch((e) => {
        this.setState({ error: e.message });
      });
  }

  render() {
    const { searchFirstname, currentPerson, familyTree, currentIndex, loading, error, searchPerformed } = this.state;
    const { people } = this.props;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by firstname"
              value={searchFirstname}
              onChange={this.onChangeSearchFirstname}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.findByFirstname}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>People List</h4>
          {loading ? (
            <div>Loading...</div>
          ) : searchPerformed ? (
            <ul className="list-group">
              {people &&
                people.map((person, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActivePerson(person, index)}
                    key={index}
                  >
                    {person.firstname} {person.lastname}
                  </li>
                ))}
            </ul>
          ) : (
            <div>Please perform a search to see the list of people.</div>
          )}
        </div>
        <div className="col-md-6">
          {currentPerson ? (
            <div>
              <h4>Person</h4>
              <div>
                <label>
                  <strong>First name:</strong>
                </label>{" "}
                {currentPerson.firstname}
              </div>
              <div>
                <label>
                  <strong>Last name:</strong>
                </label>{" "}
                {currentPerson.lastname}
              </div>
              <div>
                <label>
                  <strong>Gender:</strong>
                </label>{" "}
                {currentPerson.gender}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentPerson.deceased ? "Deceased" : "Living"}
              </div>
              <div>
                <label>
                  <strong>Immediate relatives:</strong>
                </label>
                <ul>
                  {currentPerson.immediaterelatives.map((immediaterelative) => (
                    <li key={immediaterelative._id}>
                      <button
                        className="btn btn-link"
                        onClick={() => this.handleImmediateRelativeClick(immediaterelative._id)}
                      >
                        {immediaterelative.fullname} ({immediaterelative.relationship})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={"/people/" + currentPerson.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
              <button onClick={() => this.showFamilyTree(currentPerson.id)}>
                Show Family Tree
              </button>
              {this.renderFamilyTree(familyTree[currentPerson.id])}
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Person...</p>
            </div>
          )}
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    people: state.people,
  };
};

export default connect(mapStateToProps, {
  retrievePeople,
  findPeopleByFirstname,
})(PeopleList);
