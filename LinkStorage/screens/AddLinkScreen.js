import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import Color from '../constants/color';

const AddLinkScreen = (props) => {
  const categories = useSelector((state) => state.categories.categories);

  const categoriesItems = categories.map((category, i) => {
    return {
      label: category.name,
      value: category.name,
      color: category.color,
    };
  });

  const [selectedCategory, setSelectedCategory] = useState(
    categoriesItems[0].value,
  );

  const [URL, setURL] = useState('');
  const [description, setDescription] = useState('');

  const URLChangeHandler = (text) => {
    setURL(text);
  };

  const descriptionChangeHandler = (text) => {
    setDescription(text);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>Select Category</Text>
        </View>
        <DropDownPicker
          items={categoriesItems}
          defaultValue={categoriesItems[0].value}
          containerStyle={styles.containerStyle}
          style={styles.dropdownstyle}
          itemStyle={styles.itemStyle}
          dropDownStyle={styles.dropDownStyle}
          onChangeItem={(item) => setSelectedCategory(item.value)}
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
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </View>
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
});

export default AddLinkScreen;
