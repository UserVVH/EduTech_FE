// src/Redux/store.js
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Correct named import
import rootReducer from "./reducers/rootReducer";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
