// actions.js
import {
  FETCH_DOCUMENT_REQUEST,
  FETCH_DOCUMENT_SUCCESS,
  FETCH_DOCUMENT_FAILURE,
} from "./actionTypes";

export const fetchDocumentRequest = () => ({
  type: FETCH_DOCUMENT_REQUEST,
});

export const fetchDocumentSuccess = (document) => ({
  type: FETCH_DOCUMENT_SUCCESS,
  payload: document,
});

export const fetchDocumentFailure = (error) => ({
  type: FETCH_DOCUMENT_FAILURE,
  payload: error,
});
