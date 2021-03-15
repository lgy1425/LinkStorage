import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
} from '../action/category';

const initialState = {
  categories: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {...state, categories: action.categories};

    case CREATE_CATEGORY:
      return {...state, categories: state.categories.concat(action.category)};
    case UPDATE_CATEGORY:
      const cIndex = state.categories.findIndex(
        (category) => category.id === action.category.id,
      );

      const updatedCategories = [...state.categories];
      updatedCategories[cIndex] = action.category;
      return {...state, categories: updatedCategories};
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.deleteId,
        ),
      };
    default:
      return state;
  }
};
