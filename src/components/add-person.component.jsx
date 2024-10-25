// add-person.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { createPerson } from "../actions/people";

class AddPerson extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeLastname = this.onChangeLastname.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.savePerson = this.savePerson.bind(this);
    this.newPerson = this.newPerson.bind(this);

    this.state = {
      id: null,
      firstname: "",
      lastname: "",
      gender: "",
      deceased: false,
      submitted: false,
      error: null,
    };
  }

  onChangeFirstname(e) {
    this.setState({
      firstname: e.target.value,
    });
  }

  onChangeLastname(e) {
    this.setState({
      lastname: e.target.value,
    });
  }

  onChangeGender(e) {
    this.setState({
      gender: e.target.value,
    });
  }

  savePerson() {
    const { firstname, lastname, gender } = this.state;

    if (!firstname || !lastname || !gender) {
      this.setState({ error: "Firstname, Lastname, and Gender are required!" });
      return;
    }

    this.props
      .createPerson(firstname, lastname, gender)
      .then((data) => {
        this.setState({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          gender: data.gender,
          deceased: data.deceased,
          submitted: true,
          error: null,
        });
        console.log(data);
      })
      .catch((e) => {
        this.setState({ error: e.message });
        console.log(e);
      });
  }

  newPerson() {
    this.setState({
      id: null,
      firstname: "",
      lastname: "",
      gender: "",
      deceased: false,
      submitted: false,
      error: null,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newPerson}>
              Add
            </button>
          </div>
        ) : (
          <div>
            {this.state.error && (
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                className="form-control"
                id="firstname"
                required
                value={this.state.firstname}
                onChange={this.onChangeFirstname}
                name="firstname"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                required
                value={this.state.lastname}
                onChange={this.onChangeLastname}
                name="lastname"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="form-control"
                value={this.state.gender}
                onChange={this.onChangeGender}
                name="gender"
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <button onClick={this.savePerson} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { createPerson })(AddPerson);
