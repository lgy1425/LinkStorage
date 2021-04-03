/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const {data} = remoteMessage;
  console.log(data, 'remote..!!');
});

messaging().onNotificationOpenedApp((remoteMessage) => {
  console.log('[push] onNotificationOpenedApp in index.js', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
