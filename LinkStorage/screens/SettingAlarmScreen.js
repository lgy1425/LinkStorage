import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button} from 'react-native-paper';
import Color from '../constants/color';
import DeviceInfo from 'react-native-device-info';

const SettingAlarmScreen = (props) => {
  const [date, setDate] = useState(new Date());

  const saveAlarm = () => {
    console.log(date);
    const now = new Date();
    const utcTimeOffset = now.getTimezoneOffset() / 60;
    console.log(utcTimeOffset);
  };

  const onCancel = () => {
    props.navigation.goBack();
  };

  return (
    <View style={styles.centered}>
      <DatePicker date={date} onDateChange={setDate} />
      <View style={styles.buttonWrapper}>
        <Button mode="text" color={Color.primaryColor} onPress={onCancel}>
          Cancel
        </Button>
        {props.navigation.getParam('id') !== -1 && (
          <Button mode="text" color={Color.primaryColor}>
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
