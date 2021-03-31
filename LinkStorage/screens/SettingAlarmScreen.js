import React, {useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button} from 'react-native-paper';
import Color from '../constants/color';
import Constant from '../constants/contant';

const SettingAlarmScreen = (props) => {
  const [date, setDate] = useState(props.navigation.getParam('display_time'));
  const [isLoading, setIsLoading] = useState(false);

  const saveAlarm = () => {
    const now = new Date();
    const utcTimeOffset = now.getTimezoneOffset() / 60;

    setIsLoading(true);

    fetch(`${Constant.base_url}/link/update/alarm`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: props.navigation.getParam('id'),
        display_time: date,
        local_timezone: utcTimeOffset,
        link_id: props.navigation.getParam('linkId'),
      }),
    }).then((res) => {
      setIsLoading(false);
      props.navigation.goBack();
    });
  };

  const onCancel = () => {
    props.navigation.goBack();
  };

  const offAlarm = () => {
    setIsLoading(true);

    fetch(`${Constant.base_url}/link/delete/alarm`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: props.navigation.getParam('id'),
      }),
    }).then((res) => {
      setIsLoading(false);
      props.navigation.goBack();
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <DatePicker date={date} onDateChange={setDate} />
      <View style={styles.buttonWrapper}>
        <Button mode="text" color={Color.primaryColor} onPress={onCancel}>
          Cancel
        </Button>
        {props.navigation.getParam('id') !== -1 && (
          <Button mode="text" color={Color.primaryColor} onPress={offAlarm}>
            Off Alarm
          </Button>
        )}
        <Button mode="text" onPress={saveAlarm} color={Color.primaryColor}>
          Save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SettingAlarmScreen;
