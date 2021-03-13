import Contant from '../../constants/contant';
import DefaultPreference from 'react-native-default-preference';

export const GET_CATEGORIES = 'GET_CATEGORIES';

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

        dispatch({type: GET_CATEGORIES, categories: [createResponse.category]});
      }
    } catch (err) {
      throw err;
    }
  };
};
