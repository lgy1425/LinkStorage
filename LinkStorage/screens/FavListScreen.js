import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import * as db from '../helper/db';
import LinkCard from '../components/LinkCard';

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
  }, [fetchStarLinks, props.navigation]);

  let linkCards = null;

  if (links) {
    linkCards = (
      <FlatList
        data={links}
        keyExtractor={(item) => String(item.id)}
        renderItem={(itemData) => (
          <LinkCard link={itemData.item} navigation={props.navigation} />
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      {links &&
        (links.length === 0 ? (
          <View style={styles.centered}>
            <View>
              <Text>Please Add Important Links</Text>
            </View>
          </View>
        ) : (
          <View>{linkCards}</View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
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
