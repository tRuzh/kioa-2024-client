// add-immediaterelative.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { findPeopleByFirstname } from "../actions/people";

class AddImmediateRelative extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchFirstname = this.onChangeSearchFirstname.bind(this);
    this.searchImmediateRelatives = this.searchImmediateRelatives.bind(this);
    this.selectImmediateRelative = this.selectImmediateRelative.bind(this);

    this.state = {
      searchFirstname: "",
      selectedImmediateRelative: null,
      relationship: "",
      searchPerformed: false,
    };
  }

  onChangeSearchFirstname(e) {
    const searchFirstname = e.target.value;
    this.setState({ searchFirstname });
  }

  searchImmediateRelatives() {
    this.props.findPeopleByFirstname(this.state.searchFirstname);
    this.setState({ searchPerformed: true });
  }

  selectImmediateRelative(immediaterelative) {
    this.setState({ selectedImmediateRelative: immediaterelative });
  }

  render() {
    const { searchFirstname, selectedImmediateRelative, relationship, searchPerformed } = this.state;
    const { people } = this.props;

    return (
      <div>
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
              onClick={this.searchImmediateRelatives}
            >
              Search
            </button>
          </div>
        </div>
        {searchPerformed && (
          <ul className="list-group">
            {people &&
              people.map((person) => (
                <li
                  className="list-group-item"
                  onClick={() => this.selectImmediateRelative(person)}
                  key={person._id}
                >
                  {person.firstname} {person.lastname} ({person.gender})
                </li>
              ))}
          </ul>
        )}
        {selectedImmediateRelative && (
          <div>
            <h4>Selected ImmediateRelative</h4>
            <p>{selectedImmediateRelative.firstname} {selectedImmediateRelative.lastname} ({selectedImmediateRelative.gender})</p>
            <div className="form-group">
              <label htmlFor="relationship">Relationship</label>
              <select
                id="relationship"
                className="form-control"
                value={relationship}
                onChange={(e) => this.setState({ relationship: e.target.value })}
              >
                <option value=""></option>
                <option value="Parent">Parent</option>
                <option value="Adopted parent">Adopted parent</option>
                <option value="Stepparent">Stepparent</option> 
                <option value="Spouse">Spouse</option>
                <option value="Ex-spouse">Ex-spouse</option>
                <option value="Child">Child</option>
                <option value="Adopted child">Adopted child</option>
                <option value="Stepchild">Stepchild</option>
              </select>
            </div>
            <button
              className="btn btn-success"
              onClick={() => this.props.onAddImmediateRelative(selectedImmediateRelative, relationship)}
            >
              Add ImmediateRelative
            </button>
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

export default connect(mapStateToProps, { findPeopleByFirstname })(AddImmediateRelative);