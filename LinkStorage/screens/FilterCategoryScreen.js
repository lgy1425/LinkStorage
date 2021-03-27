import React from 'react';
import {useSelector} from 'react-redux';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';

const FilterCategoryScreen = (props) => {
  const categories = useSelector((state) => state.categories.categories);

  const categorySelectHandler = (category) => {
    props.navigation.state.params.setFilteredCategory(category);
    props.navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          categorySelectHandler(null);
        }}>
        <View style={styles.categoryRow}>
          <View style={styles.colorWrapper} />

          <View style={styles.nameWrapper}>
            <Text>All Category</Text>
          </View>
        </View>
      </TouchableOpacity>
      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={(itemData) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              categorySelectHandler(itemData.item);
            }}>
            <View style={styles.categoryRow}>
              <View style={styles.colorWrapper}>
                <View
                  style={[
                    styles.colorTouch,
                    {backgroundColor: itemData.item.color},
                  ]}
                />
              </View>
              <View style={styles.nameWrapper}>
                <Text>{itemData.item.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  colorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameWrapper: {
    flex: 4,
    justifyContent: 'center',
  },
  colorTouch: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c0c0c0',
    width: 35,
    height: 35,
  },
  categoryRow: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fcfcfc',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#c0c0c0',
  },
});

export default FilterCategoryScreen;
