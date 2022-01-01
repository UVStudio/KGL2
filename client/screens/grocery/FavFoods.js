import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import LoadingScreen from '../../components/UI/LoadingScreen';
import FoodCard from '../../components/UI/FoodCard';
import * as foodsActions from '../../store/actions/foods';

const FavFoods = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const foods = useSelector((state) => state.foods.foods);
  const favFoods = useSelector((state) => state.foods.favFoods);

  const dispatch = useDispatch();

  const favFoodsFullData = [];

  const search = (foods, favFoods) => {
    for (let i = 0; i < foods.length; i++) {
      for (let j = 0; j < favFoods.length; j++) {
        if (foods[i]._id === favFoods[j]) {
          favFoodsFullData.push(foods[i]);
        }
      }
      if (favFoodsFullData.length === favFoods.length) {
        return;
      }
    }
  };

  search(foods, favFoods);

  const getFavs = async () => {
    await dispatch(foodsActions.getFavs());
    setIsLoading(false);
  };

  useEffect(() => {
    getFavs();
  }, []);

  const selectFoodDetailsHandler = (name) => {
    props.navigation.navigate('Food Details', {
      name,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favFoods.length !== 0 ? (
        <FlatList
          data={favFoodsFullData}
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
      ) : (
        <View style={styles.noFavContainer}>
          <Text style={styles.noFav}>
            Looks like you don't have any favourite foods. You can browse
            through our keto friendly foods under 'Food Groups' and find some
            foods to add to this list.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFavContainer: {
    width: 300,
    alignItems: 'center',
  },
  noFav: {
    fontFamily: 'open-sans',
    fontSize: 18,
    color: 'black',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavFoods;
