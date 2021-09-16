import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import FoodCard from '../../components/UI/FoodCard';

const FoodGroupItems = (props) => {
  const foodType = props.route.params;
  const groupFoods = useSelector((state) =>
    state.foods.foods.filter((group) => group.foodType === foodType)
  );

  const groupFoodsSorted = groupFoods.sort((x, y) => {
    let xName = x.name;
    let yName = y.name;
    if (xName < yName) {
      return -1;
    }
    if (xName > yName) {
      return 1;
    }
    return 0;
  });

  const selectFoodDetailsHandler = (name) => {
    props.navigation.navigate('Food Details', {
      name,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groupFoodsSorted}
        keyExtractor={(item) => item._id}
        renderItem={(itemData) => (
          <FoodCard
            image={itemData.item.imageUrl}
            title={itemData.item.name}
            id={itemData.item._id}
            onSelect={() => selectFoodDetailsHandler(itemData.item.name)}
          />
        )}
      />
    </View>
  );
};

export const foodGroupItemsScreenOptions = (navData) => {
  return {
    headerTitle: navData.route.params,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FoodGroupItems;
