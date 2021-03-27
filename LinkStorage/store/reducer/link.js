import {CREATE_LINK, GET_LINKS, SET_CURRENT_SEARCHKEY} from '../action/link';

const initialState = {
  links: null,
  currentSearchKey: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LINK:
      return {
        ...state,
        links: [action.result.link].concat(state.links),
        currentSearchKey: '',
      };
    case GET_LINKS:
      return {...state, links: action.links};
    case SET_CURRENT_SEARCHKEY:
      return {...state, currentSearchKey: action.search_key};
    default:
      return state;
  }
};
