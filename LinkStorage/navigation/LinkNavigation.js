import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import Color from '../constants/color';
import {Platform} from 'react-native';

import LinkListScreen from '../screens/LinkListScreen';
import FavListScreen from '../screens/FavListScreen';
import SettingScreen from '../screens/SettingScreen';

const defaultStackOptions = {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: Color.primaryColor,
    },
    headerTitleStyle: {},
    headerTintColor: 'white',
    headerBackTitle: '',
    headerBackTitleStyle: {},
  },
};

const MainNavigation = createStackNavigator(
  {
    LinkList: LinkListScreen,
  },
  defaultStackOptions,
);

const FavNavigation = createStackNavigator(
  {
    FavList: FavListScreen,
  },
  defaultStackOptions,
);

const tabScreenConfig = {
  LinkList: {
    screen: MainNavigation,
    navigationOptions: {
      tabBarLabel: 'Links',
      tabBarIcon: (tabInfo) => {
        return <Icon name="ios-link" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Color.primaryColor,
    },
  },
  FavList: {
    screen: FavNavigation,
    navigationOptions: {
      tabBarLabel: 'Stars',
      tabBarIcon: (tabInfo) => {
        return <Icon name="ios-star" size={25} color={tabInfo.tintColor} />;
      },
      tabBarColor: Color.accentColor,
    },
  },
};

const MainTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          activeTintColor: Color.accentColor,
          shifting: true,
        },
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          activeTintColor: Color.accentColor,
        },
      });

const SettingNavigator = createStackNavigator(
  {
    Setting: SettingScreen,
  },
  defaultStackOptions,
);

const MainDrawerNavigator = createDrawerNavigator(
  {
    LinkMain: {
      screen: MainTabNavigator,
      navigationOptions: {
        drawerLabel: 'Links',
      },
    },
    Settings: SettingNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Color.accentColor,
      labelStyle: {},
    },
  },
);

export default createAppContainer(MainDrawerNavigator);
