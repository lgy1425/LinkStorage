import {CREATE_CATEGORY, GET_CATEGORIES} from '../action/category';

const initialState = {
  categories: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {...state, categories: action.categories};

    case CREATE_CATEGORY:
      return {...state, categories: state.categories.concat(action.category)};
    default:
      return state;
  }
};
