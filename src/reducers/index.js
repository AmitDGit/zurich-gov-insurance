import { combineReducers } from "redux";
import { appmenuReducer as appmenu } from "./appmenu.reducer";
import { regionReducer as regionState } from "./region.reducer";
import { loginuserReducer as loginState } from "./loginuser.reducer";
import { countryReducer as countryState } from "./country.reducer";
import { segmentReducer as segmentState } from "./segment.reducer";
const rootReducer = combineReducers({
  appmenu,
  regionState,
  loginState,
  countryState,
  segmentState,
});
export default rootReducer;
