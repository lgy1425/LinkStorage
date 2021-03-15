import Contant from '../../constants/contant';
import DefaultPreference from 'react-native-default-preference';

export const GET_CATEGORIES = 'GET_CATEGORIES';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';

export const getCategories = () => {
  return async (dispatch, getState) => {
    try {
      const username = await DefaultPreference.get('username');
      const response = await fetch(
        `${Contant.base_url}/link/get/categories?username=${username}`,
      );
      if (!response.ok) {
        throw new Error('Network Error');
      }

      const resData = await response.json();

      if (resData.categories.length > 0) {
        dispatch({type: GET_CATEGORIES, categories: resData.categories});
      } else {
        const createResponse = await fetch(
          `${Contant.base_url}/link/create/category`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              username: username,
              name: 'Basic',
              color: '#c0c0c0',
            }),
          },
        );

        const createData = await createResponse.json();

        dispatch({type: GET_CATEGORIES, categories: [createData.category]});
      }
    } catch (err) {
      throw err;
    }
  };
};

export const createCategory = (name, color) => {
  return async (dispatch, getState) => {
    try {
      const username = await DefaultPreference.get('username');
      const createResponse = await fetch(
        `${Contant.base_url}/link/create/category`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            name: name,
            color: color,
          }),
        },
      );

      const createData = await createResponse.json();

      dispatch({type: CREATE_CATEGORY, category: createData.category});
    } catch (err) {
      throw err;
    }
  };
};

export const updateCategory = (id, name, color) => {
  return async (dispatch, getState) => {
    try {
      const updateResponse = await fetch(
        `${Contant.base_url}/link/update/category`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            name: name,
            color: color,
          }),
        },
      );

      const updateData = await updateResponse.json();

      dispatch({type: UPDATE_CATEGORY, category: updateData.category});
    } catch (err) {
      throw err;
    }
  };
};

export const deleteCategory = (id) => {
  return async (dispatch, getState) => {
    try {
      const deleteResponse = await fetch(
        `${Contant.base_url}/link/delete/category`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
          }),
        },
      );

      await deleteResponse.json();

      dispatch({type: DELETE_CATEGORY, deleteId: id});
    } catch (err) {
      throw err;
    }
  };
};
