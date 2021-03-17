import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';

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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
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
});

export default AddLinkScreen;
