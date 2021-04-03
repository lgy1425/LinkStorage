/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback} from 'react';
import {View, ActivityIndicator, Platform, Alert} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import Contant from './constants/contant';
import DeviceInfo from 'react-native-device-info';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import categoryReducer from './store/reducer/category';
import linkReducer from './store/reducer/link';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigation';

import LinkNavigation from './navigation/LinkNavigation';
import Toast from 'react-native-toast-message';

import * as db from './helper/db';
import messaging from '@react-native-firebase/messaging';

const rootReducer = combineReducers({
  categories: categoryReducer,
  link: linkReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const {data} = remoteMessage;
    console.log(data, 'remote..!!');
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('[push] onNotificationOpenedApp', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('[push] getInitialNotification', remoteMessage);
      }
    });

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
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  if (!deviceLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <LinkNavigation />
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Provider>
  );
}
