import {
  CREATE_LINK,
  DELETE_LINK,
  GET_LINKS,
  SET_CURRENT_SEARCHKEY,
  UPDATE_LINK,
} from '../action/link';

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
      if (action.offset === 0) {
        return {...state, links: action.links};
      } else {
        return {...state, links: state.links.concat(action.links)};
      }

    case SET_CURRENT_SEARCHKEY:
      return {...state, currentSearchKey: action.search_key};
    case UPDATE_LINK:
      const index = state.links.findIndex((link) => link.id === action.link.id);
      const updatedLinks = [...state.links];

      if (index !== -1) {
        updatedLinks[index] = action.link;
      }

      return {...state, links: updatedLinks};

    case DELETE_LINK:
      return {
        ...state,
        links: state.links.filter((link) => link.id !== action.linkId),
      };
    default:
      return state;
  }
};
