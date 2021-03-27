import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, Text, StyleSheet} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as categoryActions from '../store/action/category';

import {Searchbar} from 'react-native-paper';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const LinkListScreen = (props) => {
  const [searchKey, setSearchKey] = useState('');

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

  const onChangeSearch = (text) => setSearchKey(text);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.SearchBarWrapper}>
          <Searchbar
            placeholder="Search"
            value={searchKey}
            onChangeText={onChangeSearch}
          />
        </View>
        <View style={styles.SearchButtonWrapper}>
          <Button mode="contained" style={styles.searchBtn}>
            <Icon name="md-search" size={20} />
          </Button>
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  categorySelectWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchBarWrapper: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SearchButtonWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtn: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LinkListScreen;
