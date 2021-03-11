import {GET_CATEGORIES} from '../reducer/category';

const initialState = {
  categories: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {...state, categories: action.categories};
    default:
      return state;
  }
};
