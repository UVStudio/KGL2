import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../constants/Colors';

const SavedLists = (props) => {
  const groceryLists = useSelector((state) => state.foods.groceryLists);

  const selectListHandler = (id, name) => {
    props.navigation.navigate('Saved List Details', { id, name });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.selectLabel}>Select which list to load</Text>
        <FlatList
          data={groceryLists}
          keyExtractor={(item) => item._id}
          renderItem={(itemData) => (
            <View style={styles.listLabel}>
              <Pressable
                onPress={() =>
                  selectListHandler(itemData.item._id, itemData.item.name)
                }
              >
                <Text style={styles.listText}>{itemData.item.name}</Text>
              </Pressable>
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
    marginVertical: 8,
    borderRadius: 12,
  },
  selectLabel: {
    fontFamily: 'open-sans-bold',
    marginVertical: 4,
    marginBottom: 20,
    paddingTop: 5,
    fontSize: 17,
  },
  listText: {
    fontSize: 20,
    textAlign: 'left',
    fontFamily: 'open-sans-bold',
    color: Colors.greenText,
  },
});

export default SavedLists;
