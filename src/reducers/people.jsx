// reducer/people.jsx
import {
  CREATE_PERSON,
  RETRIEVE_PEOPLE,
  UPDATE_PERSON,
  DELETE_PERSON,
} from "../actions/types";

const initialState = [];

function personReducer(people = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_PERSON:
      return [...people, payload];

    case RETRIEVE_PEOPLE:
      return payload;

    case UPDATE_PERSON:
      return people.map((person) => {
        if (person.id === payload.id) {
          return {
            ...person,
            ...payload,
          };
        } else {
          return person;
        }
      });

    case DELETE_PERSON:
      return people.filter(({ id }) => id !== payload.id);

    default:
      return people;
  }
};

export default personReducer;