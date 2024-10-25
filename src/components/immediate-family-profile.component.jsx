// client-git/src/components/immediate-family-profile.component.jsx
import React, { Component } from "react";
import PersonDataService from "../services/person.service";

class ImmediateFamilyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    PersonDataService.get(id)
      .then((response) => {
        this.setState({
          person: response.data,
          loading: false,
        });
      })
      .catch((e) => {
        this.setState({
          error: e.message,
          loading: false,
        });
      });
  }

  render() {
    const { person, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
        <h2>{person.firstname} {person.lastname}</h2>
        <p>Gender: {person.gender}</p>
        <p>Status: {person.deceased ? "Deceased" : "Living"}</p>
        {/* Add more details as needed */}
      </div>
    );
  }
}

export default ImmediateFamilyProfile;