import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector, useDispatch} from 'react-redux';
import Color from '../constants/color';

import {validateUrl} from '../utils/util';
import * as linkActions from '../store/action/link';

import * as categoryActions from '../store/action/category';

const AddLinkScreen = (props) => {
  const dispatch = useDispatch();

  const loadCategories = useCallback(async () => {
    try {
      await dispatch(categoryActions.getCategories());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!categories) {
      loadCategories().then(() => {});
    }
  }, [categories, dispatch, loadCategories]);

  const categories = useSelector((state) => state.categories.categories);

  const updatedLink = props.navigation.getParam('link');

  let categoriesItems = [];
  if (categories) {
    categoriesItems = categories.map((category, i) => {
      return {
        label: category.name,
        value: category.id,
        color: category.color,
      };
    });
  }

  categoriesItems.push({
    label: 'Add Category',
    value: -1,
    color: '#000',
  });

  const [selectedCategory, setSelectedCategory] = useState(
    updatedLink
      ? updatedLink.category_id
      : categoriesItems
      ? categoriesItems[0].value
      : -1,
  );

  const [URL, setURL] = useState(
    updatedLink
      ? updatedLink.url
      : props.navigation.getParam('url')
      ? props.navigation.getParam('url')
      : '',
  );
  const [description, setDescription] = useState(
    updatedLink ? updatedLink.description : '',
  );
  const [isLoading, setIsLoading] = useState(false);

  const URLChangeHandler = (text) => {
    setURL(text);
  };

  const descriptionChangeHandler = (text) => {
    setDescription(text);
  };

  const saveLink = async () => {
    if (!validateUrl(URL)) {
      Alert.alert('Please enter validated URL', '', [{text: 'OK'}]);
    } else if (
      selectedCategory === -1 &&
      !props.navigation.getParam('externalShare')
    ) {
      Alert.alert('Please select category', '', [{text: 'OK'}]);
    } else {
      let category_id = selectedCategory;
      if (selectedCategory === -1) {
        category_id = categoriesItems[0].value;
      }

      setIsLoading(true);

      if (updatedLink) {
        try {
          console.log(updatedLink.id, URL, category_id, description);

          await dispatch(
            linkActions.updateLink(
              updatedLink.id,
              URL,
              category_id,
              description,
            ),
          );

          props.navigation.goBack();
        } catch (err) {
          Alert.alert('This is invalid site for saving', '', [{text: 'OK'}]);
        }
      } else {
        try {
          await dispatch(linkActions.createLink(URL, category_id, description));

          props.navigation.goBack();
        } catch (err) {
          Alert.alert('This is invalid site for saving', '', [{text: 'OK'}]);
        }
      }

      setIsLoading(false);
    }
  };

  const changeCategoryHandler = (item) => {
    if (item.value === -1) {
      setSelectedCategory(-1);
      props.navigation.navigate('EditCategories');
    } else {
      setSelectedCategory(item.value);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior="padding"
      keyboardVerticalOffset={100}>
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Select Category</Text>
          </View>
          <DropDownPicker
            items={categoriesItems}
            defaultValue={
              updatedLink
                ? updatedLink.category_id
                : categoriesItems
                ? categoriesItems[0].value
                : -1
            }
            containerStyle={styles.containerStyle}
            style={styles.dropdownstyle}
            itemStyle={styles.itemStyle}
            dropDownStyle={styles.dropDownStyle}
            onChangeItem={(item) => changeCategoryHandler(item)}
            dropDownMaxHeight={500}
          />
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>URL</Text>
          </View>
          <View style={styles.formControl}>
            <TextInput
              style={styles.textInput}
              value={URL}
              onChangeText={URLChangeHandler}
              autoCapitalize="none"
              multiline={true}
            />
          </View>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Description</Text>
          </View>
          <View style={styles.formControl}>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={descriptionChangeHandler}
              autoCapitalize="none"
              multiline={true}
            />
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.saveBtn} onPress={saveLink}>
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
  },
  dropdownstyle: {
    backgroundColor: '#fafafa',
  },
  itemStyle: {
    justifyContent: 'flex-start',
  },
  containerStyle: {
    height: 40,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
  labelWrapper: {
    height: 40,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
  },
  formControl: {
    width: '100%',
    paddingRight: 10,
    paddingLeft: 10,
  },
  textInput: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  scroll: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  saveBtn: {
    width: '100%',
    backgroundColor: Color.primaryColor,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddLinkScreen;
