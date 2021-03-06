import Contant from '../../constants/contant';
import DefaultPreference from 'react-native-default-preference';

import * as db from '../../helper/db';

export const CREATE_LINK = 'CREATE_LINK';
export const GET_LINKS = 'GET_LINKS';
export const SET_CURRENT_SEARCHKEY = 'SET_CURRENT_SEARCHKEY';
export const DELETE_LINK = 'DELETE_LINK';

export const UPDATE_LINK = 'UPDATE_LINK';
export const OPEN_REMOTE = 'OPEN_REMOTE';

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

      if (!createData.success) {
        throw 'Error';
      }

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

      dispatch({
        type: GET_LINKS,
        links: resData.links,
        search_key: search_key,
        offset: offset,
      });
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

export const updateStar = (id, star) => {
  return async (dispatch, getState) => {
    try {
      const res = await fetch(`${Contant.base_url}/link/update/link`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          star: star,
        }),
      });

      const resData = await res.json();

      dispatch({type: UPDATE_LINK, link: resData.link});
    } catch (err) {
      throw err;
    }
  };
};

export const updateLink = (id, url, category_id, description) => {
  return async (dispatch, getState) => {
    try {
      const res = await fetch(`${Contant.base_url}/link/update/link`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          description: description,
          url: url,
          category_id: category_id,
        }),
      });

      const resData = await res.json();

      await db.updateLink(
        resData.link.id,
        resData.link.url,
        resData.link.domain,
        resData.link.title,
        resData.link.description,
        resData.link.category_id,
        resData.link.category.name,
        resData.link.category.color,
        resData.link.updated_at,
        resData.link.icon,
      );

      dispatch({type: UPDATE_LINK, link: resData.link});
    } catch (err) {
      throw err;
    }
  };
};

export const deleteLink = (id) => {
  return async (dispatch, getState) => {
    try {
      await fetch(`${Contant.base_url}/link/delete/link`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      dispatch({type: DELETE_LINK, linkId: id});
    } catch (err) {
      throw err;
    }
  };
};

export const setRemoteOpen = () => {
  return async (dispatch, getState) => {
    dispatch({type: OPEN_REMOTE, link: 'hi'});
  };
};
