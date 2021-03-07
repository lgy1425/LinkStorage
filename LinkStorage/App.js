/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import DefaultPreference from 'react-native-default-preference';

export default function App() {
  const [deviceLoaded, setDeviceLoaded] = useState(false);

  useEffect(() => {
    DefaultPreference.get('test').then(function (value) {
      if (value) {
        console.log('has value', value);
        setDeviceLoaded(true);
      } else {
        fetch('https://callcenter.softgroup.co.kr/').then((response) => {
          console.log(response);
          DefaultPreference.set('test', 'my value').then(function () {
            console.log('done');
            setDeviceLoaded(true);
          });
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

  return (
    <View>
      <Text>Testing........</Text>
      <Text>Testing2........</Text>
    </View>
  );
}
