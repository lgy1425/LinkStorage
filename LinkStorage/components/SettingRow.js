import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingRow = (props) => {
  return (
    <TouchableOpacity onPress={props.onSettingSelect}>
      <View style={styles.row}>
        <Text style={styles.title}>{props.title}</Text>
        <Icon style={styles.right} name="chevron-forward-outline" size={20} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#c0c0c0',
    alignItems: 'center',
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    justifyContent: 'flex-start',
    flex: 9,
  },
  right: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default SettingRow;
