import React, {useEffect, useState, useCallback} from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Linking,
  Share,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Contant from '../constants/contant';

import {useDispatch} from 'react-redux';

import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Color from '../constants/color';

import {WebView} from 'react-native-webview';

import * as db from '../helper/db';
import * as linkActions from '../store/action/link';

import RNFetchBlob from 'rn-fetch-blob';

const LinkDetailScreen = (props) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState(null);
  const [isStar, setIsStar] = useState(0);

  const fetchLink = useCallback(async () => {
    const response = await fetch(
      `${Contant.base_url}/link/get/link?id=${props.navigation.getParam(
        'linkId',
      )}`,
    );

    const resData = await response.json();

    setLink(resData.link);
  }, [props.navigation]);

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

  const onStartChangeHandler = async () => {
    if (isStar) {
      setIsStar(0);
      await dispatch(linkActions.updateStar(link.id, 0));
      await db.deleteLink(link.id);
    } else {
      setIsStar(1);
      await dispatch(linkActions.updateStar(link.id, 1));
      await db.insertLink(
        link.id,
        link.url,
        link.domain,
        link.title,
        link.description,
        link.category_id,
        link.category.name,
        link.category.color,
      );
    }
  };

  const goToUpdate = () => {
    props.navigation.navigate('AddLink', {link: link});
  };

  const onDeleteHandler = async () => {
    Alert.alert('Warning', 'Do you want delete this link?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          await dispatch(linkActions.deleteLink(link.id));
          await db.deleteLink(link.id);
          props.navigation.goBack();
        },
      },
    ]);
  };

  const downloadPDF = async () => {
    let url;

    if (link.pdf_url && link.pdf_url.length > 0) {
      url = link.pdf_url;
    } else {
      const response = await fetch(
        `${Contant.base_url}/link/set/pdf?id=${link.id}`,
      );

      const resData = await response.json();
      url = resData.pdf_url;
    }

    if (Platform.os === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          return;
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }

    const {config, fs} = RNFetchBlob;
    let DocumentDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: DocumentDir + '/file_' + link.id + '.pdf',
        description: 'Downloading PDF file.',
      },
    };
    config(options)
      .fetch('GET', url)
      .then((res) => {
        console.log('res -> ', JSON.stringify(res));
        Alert.alert('File Download Success', 'Please check your file system', [
          {
            text: 'OK',
          },
        ]);
      });
  };

  useEffect(() => {
    fetchLink();

    const willFocusSub = props.navigation.addListener('willFocus', fetchLink);
    return () => {
      willFocusSub.remove();
    };
  }, [fetchLink, props.navigation]);

  useEffect(() => {
    if (link) {
      setIsStar(link.star);
    }
  }, [link]);

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
              mode="text"
              color={Color.primaryColor}
              style={styles.button}
              onPress={() => {
                openBrowser(link.url);
              }}>
              <Icon name={'md-share'} size={20} />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <Icon
                name={'share-social'}
                size={20}
                onPress={() => onShare(link.url)}
              />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon name={'edit'} size={20} onPress={goToUpdate} />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={'delete'}
                size={20}
                onPress={onDeleteHandler}
              />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={'file-download'}
                size={20}
                onPress={downloadPDF}
              />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <MaterialIcon
                name={isStar ? 'star' : 'star-border'}
                size={20}
                onPress={() => onStartChangeHandler()}
              />
            </Button>
            <Button
              mode="text"
              color={Color.primaryColor}
              style={styles.button}>
              <Icon
                name={'md-notifications-outline'}
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
