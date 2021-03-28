import React, {useEffect, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as db from '../helper/db';

const FavListScreen = (props) => {
  const [links, setLinks] = useState([]);

  const fetchStarLinks = useCallback(async () => {
    const ls = await db.selectLinks();
    setLinks(ls);
  }, [setLinks]);

  useEffect(() => {
    fetchStarLinks();

    const willFocusSub = props.navigation.addListener(
      'willFocus',
      fetchStarLinks,
    );
    return () => {
      willFocusSub.remove();
    };
  }, [fetchStarLinks]);

  return (
    <View>
      <Text>{links.length}</Text>
    </View>
  );
};

FavListScreen.navigationOptions = (navData) => {
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

export default FavListScreen;
