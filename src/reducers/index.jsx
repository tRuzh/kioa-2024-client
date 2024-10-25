import { combineReducers } from "redux";
import people from "./people";
import familyTree from "./familyTree";

export default combineReducers({
  people,
  familyTree,
});
