import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import CustomButton from '../../components/UI/CustomButton';

const SavedLists = (props) => {
  const groceryLists = useSelector((state) => state.foods.groceryLists);

  const selectListHandler = (id, name) => {
    props.navigation.navigate('Saved List Details', { id, name });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <FlatList
          data={groceryLists}
          keyExtractor={(item) => item._id}
          renderItem={(itemData) => (
            <View style={styles.listLabel}>
              <CustomButton
                onSelect={() =>
                  selectListHandler(itemData.item._id, itemData.item.name)
                }
              >
                <Text style={styles.listText}>{itemData.item.name}</Text>
              </CustomButton>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  listLabel: {
    width: 280,
    marginVertical: 9,
    borderRadius: 12,
  },
  listText: {
    fontSize: 20,
    paddingVertical: 12,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
});

export default SavedLists;
