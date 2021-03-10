import React from 'react';
import {View, Text} from 'react-native';

const EditCategoryScreen = (props) => {
  return (
    <View>
      <Text>EditCategoryScreen</Text>
    </View>
  );
};

EditCategoryScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Edit Categories',
  };
};

export default EditCategoryScreen;
