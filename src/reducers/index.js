import { combineReducers } from "redux";
import { appmenuReducer as appmenu } from "./appmenu.reducer";
import { regionReducer as regionState } from "./region.reducer";
import { loginuserReducer as loginState } from "./loginuser.reducer";
import { countryReducer as countryState } from "./country.reducer";
import { segmentReducer as segmentState } from "./segment.reducer";
import { lobReducer as lobState } from "./lob.reducer";
import { sublobReducer as sublobState } from "./sublob.reducer";
import { lobchapterReducer as lobchapterState } from "./lobchapter.reducer";
import { userReducer as userState } from "./user.reducer";
const rootReducer = combineReducers({
  appmenu,
  regionState,
  loginState,
  countryState,
  segmentState,
  lobState,
  sublobState,
  lobchapterState,
  userState,
});
export default rootReducer;
