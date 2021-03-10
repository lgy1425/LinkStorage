/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, Platform} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import Contant from './constants/contant';
import DeviceInfo from 'react-native-device-info';

import LinkNavigation from './navigation/LinkNavigation';

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
            console.log(responseJson.username);
            DefaultPreference.set('username', responseJson.username).then(
              function () {
                setDeviceLoaded(true);
              },
            );
          });
      }
    });
  }, []);

  if (!deviceLoaded) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <LinkNavigation />;
}
