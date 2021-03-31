/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Platform, Linking} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import Contant from './constants/contant';
import DeviceInfo from 'react-native-device-info';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import categoryReducer from './store/reducer/category';
import linkReducer from './store/reducer/link';

import LinkNavigation from './navigation/LinkNavigation';
import Toast from 'react-native-toast-message';

import * as db from './helper/db';

const rootReducer = combineReducers({
  categories: categoryReducer,
  link: linkReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  useEffect(() => {
    DefaultPreference.get('username').then(function (value) {
      if (value) {
        setDeviceLoaded(true);
      } else {
        fetch(`${Contant.base_url}/device/save`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            device_id: DeviceInfo.getUniqueId(),
            platform: Platform.OS,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            DefaultPreference.set('username', responseJson.username).then(
              function () {
                setDeviceLoaded(true);
              },
            );
          });
      }
    });

    db.createTable();
  }, []);

  useEffect(() => {
    //IOS && ANDROID : 앱이 딥링크로 처음 실행될때, 앱이 열려있지 않을 때
    Linking.getInitialURL().then((url) => console.log(url));

    //IOS : 앱이 딥링크로 처음 실행될때, 앱이 열려있지 않을 때 && 앱이 실행 중일 때
    //ANDROID : 앱이 실행 중일 때
    Linking.addEventListener('url', addListenerLink);

    return () => remover();
  }, []);

  const deepLink = (url) => {
    // if (url) {
    //   navigate('OTHER_PAGE', {share: url});
    // }
  };

  const addListenerLink = ({url}) => {
    console.log(url);
    // if (url) {
    //   navigate('OTHER_PAGE', {share: url});
    // }
  };

  const remover = () => {
    Linking.removeEventListener('url');
  };

  if (!deviceLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <LinkNavigation />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
}
