import {
  FETCH_DOCUMENT_REQUEST,
  FETCH_DOCUMENT_SUCCESS,
  FETCH_DOCUMENT_FAILURE,
} from "../actions/actionTypes";
const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  // user: null,
  // isAuthenticated: false,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: action.payload,
      };

    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_USER_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        user: { ...state.user, ...action.payload }, // Update the user data
      };
    case "UPDATE_USER_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_DOCUMENT_REQUEST:
      return { ...state, loading: true };
    case FETCH_DOCUMENT_SUCCESS:
      return { ...state, loading: false, document: action.payload };
    case FETCH_DOCUMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default authReducer;
