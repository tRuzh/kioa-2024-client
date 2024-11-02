// person.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { updatePerson, deletePerson } from "../actions/people";
import PersonDataService from "../services/person.service";
import AddImmediateFamily from "./add-immediatefamily.component";
import { Link } from "react-router-dom";

class Person extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeLastname = this.onChangeLastname.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.getPerson = this.getPerson.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.toggleAddImmediateFamily = this.toggleAddImmediateFamily.bind(this);
    this.onAddImmediateFamily = this.onAddImmediateFamily.bind(this);
    this.onDeleteImmediateFamily = this.onDeleteImmediateFamily.bind(this);
    this.state = {
      currentPerson: {
        id: null,
        firstname: "",
        lastname: "",
        gender: "male",
        deceased: false,
        immediatefamilies: [],
      },
      message: "",
      loading: false,
      error: null,
      showAddImmediateFamily: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getPerson(this.props.match.params.id)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((e) => {
        this.setState({ loading: false, error: e.message });
      });
  }

  // Update the person when the id in the URL changes
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.getPerson(this.props.match.params.id);
    }
  }

  onChangeFirstname(e) {
    const firstname = e.target.value;
    this.setState((prevState) => ({
      currentPerson: {
        ...prevState.currentPerson,
        firstname: firstname,
      },
    }));
  }

  onChangeLastname(e) {
    const lastname = e.target.value;
    this.setState((prevState) => ({
      currentPerson: {
        ...prevState.currentPerson,
        lastname: lastname,
      },
    }));
  }

  onChangeGender(e) {
    const gender = e.target.value;
    this.setState((prevState) => ({
      currentPerson: {
        ...prevState.currentPerson,
        gender: gender,
      },
    }));
  }

  getPerson(id) {
    return PersonDataService.get(id)
      .then((response) => {
        this.setState({
          currentPerson: response.data,
          loading: false,
        });
        console.log(response.data);
      })
      .catch((e) => {
        this.setState({
          error: e.message,
          loading: false,
        });
      });
  }

  updateStatus(status) {
    let data = {
      id: this.state.currentPerson.id,
      firstname: this.state.currentPerson.firstname,
      lastname: this.state.currentPerson.lastname,
      gender: this.state.currentPerson.gender,
      deceased: status,
      immediatefamilies: this.state.currentPerson.immediatefamilies,
    };
    this.props
      .updatePerson(this.state.currentPerson.id, data)
      .then((response) => {
        console.log(response);
        this.setState((prevState) => ({
          currentPerson: {
            ...prevState.currentPerson,
            deceased: status,
          },
        }));
        this.setState({ message: "The status was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ error: e.message });
      });
  }

  updateContent() {
    this.props
      .updatePerson(this.state.currentPerson.id, this.state.currentPerson)
      .then((response) => {
        console.log(response);
        this.setState({ message: "The person was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
        this.setState({ error: e.message });
      });
  }

  updateImmediateRelatives(updatedPerson) {
    const { immediatefamilies } = updatedPerson;

    immediatefamilies.forEach((relative) => {
      PersonDataService.get(relative._id)
        .then((response) => {
          const relativePerson = response.data;
          const updatedImmediateFamilies = relativePerson.immediatefamilies.map((immediatefamily) => {
            if (immediatefamily._id === updatedPerson.id) {
              return {
                ...immediatefamily,
                fullname: `${updatedPerson.firstname} ${updatedPerson.lastname}`,
                gender: updatedPerson.gender,
              };
            }
            return immediatefamily;
          });

          PersonDataService.updateImmediateFamilies(relativePerson.id, updatedImmediateFamilies)
            .then((response) => {
              console.log("Immediate relatives updated:", response.data);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  removePerson() {
    this.props
      .deletePerson(this.state.currentPerson.id)
      .then(() => {
        this.props.history.push("/people");
      })
      .catch((e) => {
        console.log(e);
        this.setState({ error: e.message });
      });
  }

  toggleAddImmediateFamily() {
    this.setState({ showAddImmediateFamily: !this.state.showAddImmediateFamily });
  }

  onAddImmediateFamily(immediatefamily, relationship) {
    if (!relationship) {
      this.setState({ error: "Relationship is required!" });
      return;
    }
    const updatedImmediateFamilies = [...this.state.currentPerson.immediatefamilies, { _id: immediatefamily.id, relationship, fullname: `${immediatefamily.firstname} ${immediatefamily.lastname}` }];
    this.setState(
      (prevState) => ({
        currentPerson: {
          ...prevState.currentPerson,
          immediatefamilies: updatedImmediateFamilies,
        },
        showAddImmediateFamily: false, // Hide AddImmediateFamily after adding
      }),
      () => {
        this.updateContent();
        this.addReciprocalRelationship(immediatefamily, relationship);
      }
    );
  }

  addReciprocalRelationship(immediatefamily, relationship) {
    let reciprocalRelationship = "";

    switch (relationship) {
      case "Parent":
        reciprocalRelationship = "Child";
        break;
      case "Adopted parent":
        reciprocalRelationship = "Adopted child";
        break;
      case "Stepparent":
        reciprocalRelationship = "Stepchild";
        break;
      case "Spouse":
        reciprocalRelationship = "Spouse";
        break;
      case "Ex-spouse":
        reciprocalRelationship = "Ex-spouse";
        break;
      case "Child":
        reciprocalRelationship = "Parent";
        break;
      case "Adopted child":
        reciprocalRelationship = "Adopted parent";
        break;
      case "Stepchild":
        reciprocalRelationship = "Stepparent";
        break;
      default:
        return;
    }

    const reciprocalImmediateFamily = {
      _id: this.state.currentPerson.id,
      relationship: reciprocalRelationship,
      fullname: `${this.state.currentPerson.firstname} ${this.state.currentPerson.lastname}`
    };

    // Call method to update the immediate families of a person
    PersonDataService.updateImmediateFamilies(immediatefamily.id, reciprocalImmediateFamily)
      .then(response => {
        console.log("Reciprocal relationship added:", response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onDeleteImmediateFamily(immediatefamilyId) {
    const updatedImmediateFamilies = this.state.currentPerson.immediatefamilies.filter(immediatefamily => immediatefamily._id !== immediatefamilyId);
    const deletedFamily = this.state.currentPerson.immediatefamilies.find(immediatefamily => immediatefamily._id === immediatefamilyId);

    this.setState(
      (prevState) => ({
        currentPerson: {
          ...prevState.currentPerson,
          immediatefamilies: updatedImmediateFamilies,
        }
      }),
      () => {
        this.updateContent();
        this.deleteReciprocalRelationship(deletedFamily);
      }
    );
  }

  deleteReciprocalRelationship(deletedFamily) {
    if (!deletedFamily) return;

    const reciprocalImmediateFamily = {
      _id: this.state.currentPerson.id,
      fullname: `${this.state.currentPerson.firstname} ${this.state.currentPerson.lastname}`
    };

    // Call method to delete the immediate family from the other person
    PersonDataService.deleteImmediateFamily(deletedFamily._id, reciprocalImmediateFamily)
      .then(response => {
        console.log("Reciprocal relationship deleted:", response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPerson, loading, error, message, showAddImmediateFamily } = this.state;

    return (
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : currentPerson ? (
          <div className="edit-form">
            <h4>Person</h4>
            <form>
              <div className="form-group">
                <label htmlFor="firstname">Firstname</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  value={currentPerson.firstname}
                  onChange={this.onChangeFirstname}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Lastname</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  value={currentPerson.lastname}
                  onChange={this.onChangeLastname}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  className="form-control"
                  value={currentPerson.gender}
                  onChange={this.onChangeGender}
                >
                  <option value=""></option> 
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentPerson.deceased ? "Deceased" : "Living"}
              </div>
            </form>
            <div className="form-group">
              <label>
                <strong>Immediate families:</strong>
              </label>
              <ul>
                {currentPerson.immediatefamilies.map((immediatefamily) => (
                  <li key={immediatefamily._id}>
                    <Link to={"/people/" + immediatefamily._id}> {immediatefamily.fullname} ({immediatefamily.relationship})</Link>
                    <button
                      className="badge badge-danger mr-2"
                      onClick={() => this.onDeleteImmediateFamily(immediatefamily._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn btn-primary" onClick={this.toggleAddImmediateFamily}>
              {showAddImmediateFamily ? "Cancel" : "Add ImmediateFamily"}
            </button>
            {showAddImmediateFamily && <AddImmediateFamily personId={currentPerson._id} onAddImmediateFamily={this.onAddImmediateFamily} />}
            {currentPerson.deceased ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateStatus(false)}
              >
                Living
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateStatus(true)}
              >
                Deceased
              </button>
            )}
            <button
              className="badge badge-danger mr-2"
              onClick={this.removePerson}
            >
              Delete
            </button>
            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateContent}
            >
              Update
            </button>
            <p>{message}</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Person...</p>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { updatePerson, deletePerson })(Person);
