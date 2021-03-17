import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Color from '../constants/color';

import Icon from 'react-native-vector-icons/Ionicons';
import * as categoryActions from '../store/action/category';
import Toast from 'react-native-toast-message';

const CategoryRow = (props) => {
  const dispatch = useDispatch();
  const [inputName, setInputName] = useState(props.value);
  const [inputColor, setInputColor] = useState(props.color);

  const colorPickerHandler = () => {
    props.navigation.navigate('CategoryColorPicker', {
      setInputColor: setInputColor,
    });
  };
  const onSaveHandler = async () => {
    try {
      await dispatch(
        categoryActions.updateCategory(props.id, inputName, inputColor),
      );
      Toast.show({
        text1: 'Save!',
        position: 'bottom',
        visibilityTime: 1500,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onDeleteHandler = async () => {
    try {
      await dispatch(categoryActions.deleteCategory(props.id));
    } catch (err) {
      Alert.alert(err, '', [{text: 'Ok'}]);
    }
  };

  const onNameChangeHandler = (text) => {
    setInputName(text);
  };

  return (
    <View style={styles.inputRow}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.categoryInput}
            onChangeText={onNameChangeHandler}
            value={inputName}
          />
        </View>
      </View>

      <View style={styles.colorWrapper}>
        <TouchableOpacity
          style={[styles.colorTouch, {backgroundColor: inputColor}]}
          onPress={colorPickerHandler}
        />
      </View>
      <View style={styles.saveWrapper}>
        <TouchableOpacity onPress={onSaveHandler}>
          <Icon
            style={styles.right}
            name="checkmark"
            size={30}
            color={Color.primaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeleteHandler}>
          <Icon
            style={styles.right}
            name="trash"
            size={30}
            color={Color.primaryColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#e3e3e3',
  },
  inputContainer: {
    flex: 6,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  categoryInput: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  colorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  colorTouch: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    width: 35,
    height: 35,
  },
});

export default CategoryRow;
