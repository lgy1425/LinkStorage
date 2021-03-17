import React, {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {View, Text} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as categoryActions from '../store/action/category';

const LinkListScreen = (props) => {
  const dispatch = useDispatch();

  const loadCategories = useCallback(async () => {
    try {
      await dispatch(categoryActions.getCategories());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCategories().then(() => {});
  }, [dispatch, loadCategories]);

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
