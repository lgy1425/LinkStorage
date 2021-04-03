import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as categoryActions from '../store/action/category';
import * as linkActions from '../store/action/link';

import {Searchbar} from 'react-native-paper';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import LinkCard from '../components/LinkCard';
import {FlatList} from 'react-native';

import ReceiveSharingIntent from 'react-native-receive-sharing-intent';

const LinkListScreen = (props) => {
  const [searchKey, setSearchKey] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [offset, setOffset] = useState(0);

  const currentSearchKey = useSelector((state) => state.link.currentSearchKey);

  const [isLoading, setIsLoading] = useState(false);
  const [isFlatLoading, setIsFlatLoading] = useState(false);

  const dispatch = useDispatch();

  const loadCategories = useCallback(async () => {
    try {
      await dispatch(categoryActions.getCategories());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  const loadLinks = useCallback(
    async (o_s) => {
      try {
        let category_id = null;
        if (filteredCategory) {
          category_id = filteredCategory.id;
        }

        await dispatch(
          linkActions.getLinks(o_s, currentSearchKey, category_id),
        );
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch, filteredCategory, currentSearchKey],
  );

  useEffect(() => {
    setIsLoading(true);
    loadCategories().then(() => {});
    loadLinks(offset).then(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loadCategories, loadLinks]);

  useEffect(() => {
    if (filteredCategory) {
      setIsLoading(true);
      setOffset(0);
      dispatch(
        linkActions.getLinks(0, currentSearchKey, filteredCategory.id),
      ).then(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      setOffset(0);
      dispatch(linkActions.getLinks(0, currentSearchKey, null)).then(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, filteredCategory, currentSearchKey]);

  const links = useSelector((state) => state.link.links);

  const onChangeSearch = (text) => {
    setSearchKey(text);
    if (text.length === 0) {
      if (currentSearchKey && currentSearchKey.length > 0) {
        setOffset(0);
        dispatch(linkActions.setCurrentSearchKey(text));
      }
    }
  };

  const search = () => {
    Keyboard.dismiss();
    setOffset(0);
    dispatch(linkActions.setCurrentSearchKey(searchKey));
  };

  let linkCards = null;

  const handLoadMore = () => {
    setIsFlatLoading(true);
    setOffset(offset + 1);
    loadLinks(offset + 1).then(() => {
      setIsFlatLoading(false);
    });
  };

  useEffect(() => {
    // To get All Recived Urls
    ReceiveSharingIntent.getReceivedFiles(
      (files) => {
        props.navigation.navigate('AddLink', {
          url: files[0].weblink,
          externalShare: true,
        });
        ReceiveSharingIntent.clearReceivedFiles();
      },
      (error) => {
        console.log(error);
      },
      'kr.ggpark.LinkStorage',
    );
  }, [props.navigation]);

  if (links) {
    linkCards = (
      <FlatList
        data={links}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handLoadMore}
        onEndReachedThreshold={0}
        refreshing={isFlatLoading}
        renderItem={(itemData) => (
          <LinkCard link={itemData.item} navigation={props.navigation} />
        )}
      />
    );
  }

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
          <Button mode="contained" style={styles.searchBtn} onPress={search}>
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

      {links && !isLoading ? (
        links.length === 0 ? (
          <View style={styles.centered}>
            <View>
              <Text>Please Add Links</Text>
              <Button
                onPress={() => {
                  props.navigation.navigate('AddLink');
                }}>
                Add Link
              </Button>
            </View>
          </View>
        ) : (
          <View>{linkCards}</View>
        )
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      )}
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
    paddingBottom: 100,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LinkListScreen;
