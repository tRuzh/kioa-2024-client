import { SET_FAMILY_TREE } from "../actions/familyTree";

const initialState = {};

const familyTreeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FAMILY_TREE:
      return action.payload;
    default:
      return state;
  }
};

export default familyTreeReducer;