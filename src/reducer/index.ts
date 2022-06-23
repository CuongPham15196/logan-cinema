import { combineReducers } from "redux";
import counterSlice from "./counter";

const rootReducer = combineReducers({
  counter: counterSlice,
});

export default rootReducer;
