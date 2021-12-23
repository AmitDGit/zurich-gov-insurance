import { combineReducers } from "redux";
import { appmenuReducer as appmenu } from "./appmenu.reducer";
import { regionReducer as regionState } from "./region.reducer";
const rootReducer = combineReducers({
  appmenu,
  regionState,
});
export default rootReducer;
