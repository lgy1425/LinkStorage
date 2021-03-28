import React, {useEffect, useState, useCallback} from 'react';

import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import Contant from '../constants/contant';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Color from '../constants/color';

import {WebView} from 'react-native-webview';

const LinkDetailScreen = (props) => {
  const [link, setLink] = useState(null);

  const fetchLink = useCallback(async () => {
    const response = await fetch(
      `${Contant.base_url}/link/get/link?id=${props.navigation.getParam(
        'linkId',
      )}`,
    );

    const resData = await response.json();

    setLink(resData.link);
  }, []);

  useEffect(() => {
    fetchLink();
  }, [fetchLink]);

  if (link) {
    return (
      <View style={styles.container}>
        <View style={styles.informationWrapper}>
          <View style={styles.textRow}>
            <Text style={styles.titleText}>{link.title}</Text>
          </View>
          <View style={styles.textRow}>
            <Image source={{uri: link.icon}} style={styles.favicon} />
            <Text numberOfLines={1} style={styles.urlText}>
              {link.url}
            </Text>
          </View>
          <View style={styles.textRow}>
            <Text style={styles.descriptionText}>{link.description}</Text>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}
              onPress={() => {
                openBrowser(link.url);
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
                onPress={() => onShare(link.url)}
              />
            </Button>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={'edit'}
                size={20}
                onPress={() => onShare(link.url)}
              />
            </Button>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={'delete'}
                size={20}
                onPress={() => onShare(link.url)}
              />
            </Button>
            <Button
              mode="contained"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={'file-download'}
                size={20}
                onPress={() => onShare(link.url)}
              />
            </Button>
          </View>
        </View>
        <View style={styles.webviewContainer}>
          <WebView originWhitelist={['*']} source={{uri: link.url}} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRow: {
    marginTop: 5,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 20,
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
    fontSize: 16,
  },
  informationWrapper: {
    padding: 10,
  },
  buttonWrapper: {
    flexDirection: 'column',
  },
  button: {},
  buttonRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  webviewContainer: {
    flex: 1,
  },
});

export default LinkDetailScreen;
