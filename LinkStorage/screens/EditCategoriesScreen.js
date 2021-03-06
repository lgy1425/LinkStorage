import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, TextInput, FlatList, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '../constants/color';

import CategoryRow from '../components/CategoryRow';
import Icon from 'react-native-vector-icons/Ionicons';

import * as categoryActions from '../store/action/category';

const EditCategoryScreen = (props) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

  const [inputColor, setInputColor] = useState('#ffffff');
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    for (let i = 0; i < Color.cColors.length; i++) {
      if (categories.filter((c) => c.color === Color.cColors[i]).length === 0) {
        setInputColor(Color.cColors[i]);
        break;
      }
    }
  }, [setInputColor, categories]);

  const colorPickerHandler = () => {
    props.navigation.navigate('CategoryColorPicker', {
      setInputColor: setInputColor,
    });
  };

  const onNameChangeHandler = (text) => {
    setInputName(text);
  };

  const onSaveHandler = async () => {
    if (inputName.length === 0 || inputName.length > 10) {
      Alert.alert("Category name's length should be between 1 , 10", '', [
        {text: 'OK'},
      ]);
    } else {
      try {
        setInputName('');
        await dispatch(categoryActions.createCategory(inputName, inputColor));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.categoryInput}
              onChangeText={onNameChangeHandler}
              placeholder={"Input category's name"}
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
        </View>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={(itemData) => (
          <CategoryRow
            value={itemData.item.name}
            color={itemData.item.color}
            id={itemData.item.id}
            navigation={props.navigation}
          />
        )}
      />
    </View>
  );
};

EditCategoryScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Edit Categories',
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    backgroundColor: Color.gray,
    borderBottomWidth: 1,
    borderBottomColor: '#5e5e5e',
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
  },
  colorTouch: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    width: 35,
    height: 35,
  },
});

export default EditCategoryScreen;
