// add-immediatefamily.component.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { findPeopleByFirstname } from "../actions/people";

class AddImmediateFamily extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchFirstname = this.onChangeSearchFirstname.bind(this);
    this.searchImmediateFamilies = this.searchImmediateFamilies.bind(this);
    this.selectImmediateFamily = this.selectImmediateFamily.bind(this);

    this.state = {
      searchFirstname: "",
      selectedImmediateFamily: null,
      relationship: "",
      searchPerformed: false,
    };
  }

  onChangeSearchFirstname(e) {
    const searchFirstname = e.target.value;
    this.setState({ searchFirstname });
  }

  searchImmediateFamilies() {
    this.props.findPeopleByFirstname(this.state.searchFirstname);
    this.setState({ searchPerformed: true });
  }

  selectImmediateFamily(immediatefamily) {
    this.setState({ selectedImmediateFamily: immediatefamily });
  }

  render() {
    const { searchFirstname, selectedImmediateFamily, relationship, searchPerformed } = this.state;
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
              onClick={this.searchImmediateFamilies}
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
                  onClick={() => this.selectImmediateFamily(person)}
                  key={person._id}
                >
                  {person.firstname} {person.lastname} ({person.gender})
                </li>
              ))}
          </ul>
        )}
        {selectedImmediateFamily && (
          <div>
            <h4>Selected ImmediateFamily</h4>
            <p>{selectedImmediateFamily.firstname} {selectedImmediateFamily.lastname} ({selectedImmediateFamily.gender})</p>
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
              onClick={() => this.props.onAddImmediateFamily(selectedImmediateFamily, relationship)}
            >
              Add ImmediateFamily
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

export default connect(mapStateToProps, { findPeopleByFirstname })(AddImmediateFamily);
