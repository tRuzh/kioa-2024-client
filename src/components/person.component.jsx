// client-git/src/components/person.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { updatePerson, deletePerson } from "../actions/people";
import PersonDataService from "../services/person.service";
import AddImmediateRelative from "./add-immediaterelative.component";
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
    this.toggleAddImmediateRelative = this.toggleAddImmediateRelative.bind(this);
    this.onAddImmediateRelative = this.onAddImmediateRelative.bind(this);
    this.onDeleteImmediateRelative = this.onDeleteImmediateRelative.bind(this);
    this.state = {
      currentPerson: {
        id: null,
        firstname: "",
        lastname: "",
        gender: "male",
        deceased: false,
        immediaterelatives: [],
      },
      message: "",
      loading: true,
      error: null,
      showAddImmediateRelative: false,
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
      this.setState({ currentPerson: null, loading: true, error: null, message: "", showAddImmediateRelative: false });
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
        //console.log(response.data);
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
      firstname: this.state.currentPerson.firstname.trim(),
      lastname: this.state.currentPerson.lastname.trim(),
      gender: this.state.currentPerson.gender,
      deceased: status,
      immediaterelatives: this.state.currentPerson.immediaterelatives,
    };
    this.props
      .updatePerson(this.state.currentPerson.id, data)
      .then((response) => {
        //console.log(response);
        this.setState((prevState) => ({
          currentPerson: {
            ...prevState.currentPerson,
            deceased: status,
          },
        }));
        this.setState({ message: "The status was updated successfully!" });
      })
      .catch((e) => {
        //console.log(e);
        this.setState({ error: e.message });
      });
  }

  updateContent() {
    const { currentPerson } = this.state;
    this.props
      .updatePerson(currentPerson.id, currentPerson)
      .then((response) => {
        this.setState({ 
          message: "The person was updated successfully!",
          error: null,
        });
      })
      .catch((e) => {
        this.setState({
          error: e.response.data.message,
        });
        console.log(e);
      });
  }

  removePerson() {
    if (window.confirm("Are you sure you want to delete this person?")) {
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
  }

  toggleAddImmediateRelative() {
    this.setState({ showAddImmediateRelative: !this.state.showAddImmediateRelative });
  }
  
  // Add an immediate relative
  onAddImmediateRelative(immediaterelative, relationship) {
    if (!relationship) {
      this.setState({ error: "Relationship is required!" });
      return;
    }

    // Check if person is trying to add itself as a relative
    if (immediaterelative.id === this.state.currentPerson.id) {
      this.setState({ error: "Cannot add yourself as a relative." });
      return;
    }

    // Check for duplications
    const existingRelative = this.state.currentPerson.immediaterelatives.find(relative => relative._id === immediaterelative.id);
    if (existingRelative) {
      this.setState({ error: "This relative already exists." });
      return;
    }

    // Prepare data for the server
    const data = {
      personId: this.state.currentPerson.id,
      immediaterelativeId: immediaterelative.id,
      fullname: `${immediaterelative.firstname} ${immediaterelative.lastname}`,
      relationship,
      reciprocalFullname: `${this.state.currentPerson.firstname} ${this.state.currentPerson.lastname}`
    };

    // Call the server to add the immediate relative
    PersonDataService.addImmediateRelative(data)
      .then(response => {
        this.setState(
          (prevState) => ({
            currentPerson: {
              ...prevState.currentPerson,
              immediaterelatives: [...prevState.currentPerson.immediaterelatives, { _id: immediaterelative.id, relationship, fullname: `${immediaterelative.firstname} ${immediaterelative.lastname}` }],
            },
            showAddImmediateRelative: false, // Hide AddImmediateRelative after adding
            message: response.data.message.includes("successfully") ? response.data.message : "", // Set the success message from the server 
            error: response.data.message.includes("successfully") ? "" : response.data.message,// Set the error message from the server
          })/*,
          () => {
            this.updateContent();
          }*/
        );
      })
      .catch(e => {
        this.setState({ error: e.response.data.message });
      });
  }

  /**
   * Deletes an immediate relative from the current person's list of immediate relatives.
   * 
   * @param {string} immediaterelativeId - The ID of the immediate relative to be deleted.
   * @returns {void}
   */
  onDeleteImmediateRelative(immediaterelativeId) {
    if (window.confirm("Are you sure you want to delete this immediate relative?")) {
      const updatedImmediateRelatives = this.state.currentPerson.immediaterelatives.filter(immediaterelative => immediaterelative._id !== immediaterelativeId);
      const deletedRelative = this.state.currentPerson.immediaterelatives.find(immediaterelative => immediaterelative._id === immediaterelativeId);

      this.setState(
        (prevState) => ({
          currentPerson: {
            ...prevState.currentPerson,
            immediaterelatives: updatedImmediateRelatives,
          }
        }),
        () => {
          this.updateContent();
          this.deleteReciprocalRelationship(deletedRelative);
        }
      );
    }
  }

  /**
   * Deletes the reciprocal relationship of the deleted relative.
   *
   * @param {Object} deletedRelative - The deleted relative object.
   */
  deleteReciprocalRelationship(deletedRelative) {
    if (!deletedRelative) return;

    const reciprocalImmediateRelative = {
      _id: this.state.currentPerson.id,
      //fullname: `${this.state.currentPerson.firstname} ${this.state.currentPerson.lastname}`  not needed
    };

    // Call method to delete the immediate relative from the other person
    PersonDataService.deleteImmediateRelative(deletedRelative._id, reciprocalImmediateRelative)
      .then(response => {
        console.log("Reciprocal relationship deleted:", response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentPerson, loading, error, message, showAddImmediateRelative } = this.state;

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
                <strong>Immediate relatives:</strong>
              </label>
              <ul>
                {currentPerson.immediaterelatives.map((immediaterelative) => (
                  <li key={immediaterelative._id}>
                    <Link to={"/people/" + immediaterelative._id}> {immediaterelative.fullname} ({immediaterelative.relationship})</Link>
                    <button
                      className="badge badge-danger mr-2"
                      onClick={() => this.onDeleteImmediateRelative(immediaterelative._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="btn btn-primary" onClick={this.toggleAddImmediateRelative}>
              {showAddImmediateRelative ? "Cancel" : "Add ImmediateRelative"}
            </button>
            {showAddImmediateRelative && <AddImmediateRelative personId={currentPerson._id} onAddImmediateRelative={this.onAddImmediateRelative} />}
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
