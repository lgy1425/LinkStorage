import React from 'react';
import Color from '../constants/color';
import {View, StyleSheet, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CategoryColorPickerScreen = (props) => {
  const colorSelectHandler = (color) => {
    props.navigation.state.params.setInputColor(color);
    props.navigation.goBack();
  };

  const colorBoxes = [...Array(Color.cColors.length / 2).keys()].map((c, i) => {
    return (
      <View style={styles.row} key={c}>
        <View style={styles.colorBoxWrapper}>
          <TouchableOpacity
            style={[styles.colorBox, {backgroundColor: Color.cColors[i * 2]}]}
            onPress={() => colorSelectHandler(Color.cColors[i * 2])}
          />
        </View>
        <View style={styles.colorBoxWrapper}>
          <TouchableOpacity
            style={[
              styles.colorBox,
              {backgroundColor: Color.cColors[i * 2 + 1]},
            ]}
            onPress={() => colorSelectHandler(Color.cColors[i * 2 + 1])}
          />
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.wrapper}>{colorBoxes}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#ccc',
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 180,
  },
  colorBoxWrapper: {
    flex: 1,
  },
  colorBox: {
    height: '100%',
    width: '100%',
  },
});

export default CategoryColorPickerScreen;
