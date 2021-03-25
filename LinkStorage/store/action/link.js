import Contant from '../../constants/contant';
import DefaultPreference from 'react-native-default-preference';

export const CREATE_LINK = 'CREATE_LINK';

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

      console.log(createResponse);

      const createData = await createResponse.json();

      dispatch({type: CREATE_LINK, result: createData});
    } catch (err) {
      throw err;
    }
  };
};
