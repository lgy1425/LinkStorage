import React from 'react';
import {View, Text} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

const LinkListScreen = (props) => {
  return (
    <View>
      <Text>LinkList....</Text>
    </View>
  );
};

LinkListScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Link Storage',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName="add"
          onPress={() => {
            navData.navigation.navigate('AddLink');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default LinkListScreen;
