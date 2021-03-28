import React, {useCallback} from 'react';
import {View, Text, StyleSheet, Image, Linking, Share} from 'react-native';

import Card from './Card';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import Color from '../constants/color';
import {TouchableOpacity} from 'react-native';

const LinkCard = (props) => {
  const openBrowser = useCallback(async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  }, []);

  const onShare = async (url) => {
    try {
      await Share.share({
        message: url,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const goToDetail = () => {
    props.navigation.navigate('LinkDetail', {linkId: props.link.id});
  };

  return (
    <TouchableOpacity onPress={goToDetail}>
      <Card
        style={{
          borderLeftWidth: 8,
          borderLeftColor: props.link.category.color,
        }}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text numberOfLines={1} style={styles.titleText}>
                {props.link.title}
              </Text>
            </View>

            <View style={styles.urlRow}>
              <Image source={{uri: props.link.icon}} style={styles.favicon} />
              <Text numberOfLines={1} style={styles.urlText}>
                {props.link.url}
              </Text>
            </View>
            <View style={styles.descriptionRow}>
              <Text numberOfLines={1} style={styles.descriptionText}>
                {props.link.description}
              </Text>
            </View>
          </View>
          <View style={styles.buttons}>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}
              onPress={() => {
                openBrowser(props.link.url);
              }}>
              <Icon name={'md-share'} size={20} />
            </Button>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}>
              <Icon
                name={'share-social'}
                size={20}
                onPress={() => onShare(props.link.url)}
              />
            </Button>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 8,
  },
  buttons: {
    flex: 2,
    flexDirection: 'column',
  },
  titleRow: {
    flex: 2,
    flexDirection: 'row',
    height: 30,
    paddingRight: 10,
    marginRight: 10,
  },
  descriptionRow: {
    flex: 2,
    flexDirection: 'row',
    height: 25,
    paddingRight: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  urlRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    width: '100%',
    paddingRight: 10,
    marginRight: 10,
  },

  titleText: {
    flex: 5,
    fontSize: 15,
  },
  favicon: {
    width: 15,
    height: 15,
  },
  urlText: {
    color: '#c0c0c0',
    paddingLeft: 5,
  },
  descriptionText: {
    color: '#787878',
  },
  button: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    marginTop: 2,
  },
});

export default LinkCard;
