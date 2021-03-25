import {CREATE_LINK} from '../action/link';

const initialState = {
  links: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_LINK:
      return {...state, links: state.links.concat(action.result.link)};
    default:
      return state;
  }
};
