import Contant from '../../constants/contant';
import DefaultPreference from 'react-native-default-preference';

export const CREATE_LINK = 'CREATE_LINK';
export const GET_LINKS = 'GET_LINKS';
export const SET_CURRENT_SEARCHKEY = 'SET_CURRENT_SEARCHKEY';

export const createLink = (url, category_id, description) => {
  return async (dispatch, getState) => {
    try {
      const username = await DefaultPreference.get('username');
      const createResponse = await fetch(
        `${Contant.base_url}/link/create/link`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            username: username,
            category_id: category_id,
            description: description,
          }),
        },
      );

      const createData = await createResponse.json();

      dispatch({type: CREATE_LINK, result: createData});
    } catch (err) {
      throw err;
    }
  };
};

export const getLinks = (offset, search_key, category_id) => {
  return async (dispatch, getState) => {
    try {
      const username = await DefaultPreference.get('username');

      var parameters = `?username=${username}&offset=${offset}`;

      if (search_key && search_key.length > 0) {
        parameters += `&search_key=${search_key}`;
      }

      if (category_id && category_id > 0) {
        parameters += `&category_id=${category_id}`;
      }

      const response = await fetch(
        `${Contant.base_url}/link/get/links` + parameters,
      );
      if (!response.ok) {
        throw new Error('Network Error');
      }

      const resData = await response.json();

      dispatch({type: GET_LINKS, links: resData.links, search_key: search_key});
    } catch (err) {
      throw err;
    }
  };
};

export const setCurrentSearchKey = (search_key) => {
  return (dispatch, getState) => {
    dispatch({type: SET_CURRENT_SEARCHKEY, search_key: search_key});
  };
};
