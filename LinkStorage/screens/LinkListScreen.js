import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as categoryActions from '../store/action/category';

import {Searchbar} from 'react-native-paper';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const LinkListScreen = (props) => {
  const [searchKey, setSearchKey] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(null);

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

  useEffect(() => {
    console.log('change filtercategory');
  }, [filteredCategory]);

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
      <TouchableOpacity
        style={styles.filterCategoryRow}
        onPress={() => {
          props.navigation.navigate('FilterCategory', {
            setFilteredCategory: setFilteredCategory,
          });
        }}>
        {filteredCategory ? (
          <View style={styles.filterCategoryRow}>
            <View style={styles.colorWrapper}>
              <View
                style={[
                  styles.colorTouch,
                  {backgroundColor: filteredCategory.color},
                ]}
              />
            </View>
            <View style={styles.nameWrapper}>
              <Text>{filteredCategory.name}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.filterCategoryWrapper}>
            <Text style={styles.selectFilterText}>
              <Icon name="md-filter" size={16} />
            </Text>
            <Text style={styles.selectFilterText}>
              Select Filtered Category
            </Text>
          </View>
        )}
      </TouchableOpacity>
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
  filterCategoryRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0',
    flexDirection: 'row',
  },
  filterCategoryWrapper: {
    flexDirection: 'row',
    color: '#fff',
    width: 180,
    justifyContent: 'space-between',
  },
  selectFilterText: {
    color: '#909090',
  },
  categoryRow: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fcfcfc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorTouch: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    width: 30,
    height: 30,
  },
  nameWrapper: {
    justifyContent: 'center',
    marginLeft: 20,
  },
});

export default LinkListScreen;
