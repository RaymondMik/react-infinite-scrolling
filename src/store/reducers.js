import * as actions from "./actions";
import { BATCH_SIZE, MAX_CATALOGUE_LENGTH } from "../constants";
import { checkEndOfCatalogue } from "../services";

const initialState = {
  isFetching: true,
  hasErrored: false,
  isEndOfCatalogue: false,
  items: [],
  nextItemsBatch: [],
  currentPage: 1
};

/**
 * Get users.
 *
 * @param {Object} state.
 * @param {Object} action.
 * @returns {Object} a copy of the state modified according to the action dispatched.
 */
const users = (state = initialState, action) => {
  const isEndOfCatalogue = checkEndOfCatalogue(
    BATCH_SIZE,
    state.currentPage,
    MAX_CATALOGUE_LENGTH
  );
  switch (action.type) {
    case actions.GET_USERS:
      return {
        ...state,
        isFetching: true,
        hasErrored: false
      };
    case actions.GET_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        hasErrored: false,
        isEndOfCatalogue,
        items: [...state.items, ...action.users.results],
        currentPage: isEndOfCatalogue ? state.currentPage : state.currentPage + 1
      };
    case actions.GET_USERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasErrored: true
      };
    case actions.GET_NEXT_USERS_BATCH_SUCCESS:
      return {
         ...state,
         isFetching: false,
         hasErrored: false,
         isEndOfCatalogue,
         nextItemsBatch: action.users.results,
         currentPage: isEndOfCatalogue ? state.currentPage : state.currentPage + 1
       };
    case actions.GET_NEXT_USERS_BATCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasErrored: true
      };
    case actions.ADD_NEXT_USERS_BATCH:
      return {
        ...state,
        items: [...state.items, ...state.nextItemsBatch],
        nextItemsBatch: []
      };
   case actions.SET_END_OF_CATALOGUE:
      return {
         ...state,
         isEndOfCatalogue: true
      }
    default:
      return state;
  }
};

export default users;
