import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import SettingRow from '../components/SettingRow';

const SettingScreen = (props) => {
  return (
    <ScrollView style={styles.wrapper}>
      <SettingRow
        title="Edit Categories"
        onSettingSelect={() => {
          props.navigation.navigate('EditCategories');
        }}
      />
    </ScrollView>
  );
};

SettingScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Settings',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="md-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
});

export default SettingScreen;
