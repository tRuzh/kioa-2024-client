// people.jsx
import {
  CREATE_PERSON,
  RETRIEVE_PEOPLE,
  UPDATE_PERSON,
  DELETE_PERSON,
  ERROR
} from "./types";

import PersonDataService from "../services/person.service";

export const createPerson = (firstname, lastname, gender) => async (dispatch) => {
  try {
    const res = await PersonDataService.create({ firstname, lastname, gender });

    dispatch({
      type: CREATE_PERSON,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: err.message,
    });
    return Promise.reject(err);
  }
};

export const retrievePeople = () => async (dispatch) => {
  try {
    const res = await PersonDataService.getAll();

    dispatch({
      type: RETRIEVE_PEOPLE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: err.message,
    });
    console.log(err);
  }
};

export const updatePerson = (id, data) => async (dispatch) => {
  try {
    const res = await PersonDataService.update(id, data);

    dispatch({
      type: UPDATE_PERSON,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: err.message,
    });
    return Promise.reject(err);
  }
};

export const deletePerson = (id) => async (dispatch) => {
  try {
    await PersonDataService.delete(id);

    dispatch({
      type: DELETE_PERSON,
      payload: { id },
    });
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: err.message,
    });
    console.log(err);
  }
};

export const findPeopleByFirstname = (firstname) => async (dispatch) => {
  try {
    const res = await PersonDataService.findByFirstname(firstname);

    dispatch({
      type: RETRIEVE_PEOPLE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ERROR,
      payload: err.message,
    });
    console.log(err);
  }
};
