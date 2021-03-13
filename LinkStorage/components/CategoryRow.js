import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';

const CategoryRow = (props) => {
  return (
    <View style={styles.wrapper}>
      <TextInput value={'dd'} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
  },
});

export default CategoryRow;
