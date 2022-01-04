import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import LoadingScreen from '../../components/UI/LoadingScreen';
import CustomButton from '../../components/UI/CustomButton';
import * as foodsAction from '../../store/actions/foods';

const SavedListDetails = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const restore = async () => {
      setError(null);
      setIsRefreshing(true);
      try {
        await dispatch(foodsAction.restoreMutableList());
      } catch (err) {
        setError(err.message);
      }
      setIsRefreshing(false);
    };
    setIsLoading(true);
    restore().then(() => {
      setIsLoading(false);
    });
  }, []);

  const listId = props.route.params.id;

  const foods = useSelector((state) => state.foods.foods);
  const groceryLists = useSelector((state) => state.foods.groceryLists);

  const list = useSelector((state) =>
    state.foods.groceryLists.find((list) => list._id === listId)
  );

  const dispatch = useDispatch();

  let foodItemsIds = [];
  let listName;

  if (list) {
    foodItemsIds = list.groceryListArray;
    listName = list.name;
  }

  const foodItemsData = [];
  const foodItemsDataFn = (foodItemsIds, foods) => {
    for (let i = 0; i < foodItemsIds.length; i++) {
      for (let j = 0; j < foods.length; j++) {
        if (foodItemsIds[i] === foods[j]._id) {
          foodItemsData.push(foods[j]);
        }
      }
      if (foodItemsData.length === foodItemsIds.length) return;
    }
  };

  foodItemsDataFn(foodItemsIds, foods);

  const selectFoodDetailsHandler = (name) => {
    props.navigation.navigate('Food Details', {
      name,
    });
  };

  const deleteListByIdHandler = async (listId) => {
    if (groceryLists.length === 1) {
      Alert.alert(
        'Stop!',
        'You only have one grocery list left. You cannot delete your last list.',
        [{ text: 'Cancel', style: 'cancel' }]
      );
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(foodsAction.deleteListById(listId));
      setIsLoading(false);
      props.navigation.navigate('Saved Lists');
    } catch (err) {
      setError(err.message);
    }
  };

  const bringListIdToFront = (listId, listName) => {
    props.navigation.navigate('Current List', {
      listId,
      listName,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorContainer}>
          <Image
            style={{ width: 200, height: 200, marginBottom: 20 }}
            source={require('../../assets/nordin-round-tp.png')}
          />
          <Text style={styles.errorText}>
            An error occurred. Unable to connect to server.
          </Text>
          <View style={{ marginTop: 36 }}>
            <CustomButton
              title="Try again"
              onSelect={loadData}
              color={Colors.greenText}
              style={{ paddingHorizontal: 9, paddingVertical: 5 }}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </CustomButton>
          </View>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton
          style={{ width: 350 }}
          onSelect={() => bringListIdToFront(listId, listName)}
        >
          <Text style={styles.buttonText}>Load this list</Text>
        </CustomButton>
      </View>
      <View style={styles.listFoodContainer}>
        {foodItemsData.length === 0 ? (
          <Text style={styles.selectLabel}>
            You do not have any foods in this grocery list.
          </Text>
        ) : null}
      </View>
      <FlatList
        data={foodItemsData}
        keyExtractor={(item) => item._id}
        renderItem={(itemData) => (
          <Text
            style={styles.listText}
            onPress={() => selectFoodDetailsHandler(itemData.item.name)}
          >
            {itemData.item.name}
          </Text>
        )}
      />
      <View style={styles.buttonContainer}>
        <CustomButton onSelect={() => deleteListByIdHandler(listId)}>
          <Text style={styles.buttonText}>Delete this list</Text>
        </CustomButton>
      </View>
    </View>
  );
};

export const savedListDetailsScreenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.name,
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  listFoodContainer: {
    marginVertical: 5,
    width: 250,
  },
  listText: {
    fontSize: 20,
    fontFamily: 'open-sans',
    color: '#111',
  },
  selectLabel: {
    fontFamily: 'open-sans-bold',
    marginVertical: 3,
    marginBottom: 20,
    paddingTop: 5,
    fontSize: 17,
  },
  buttonContainer: {
    marginBottom: 20,
    width: 250,
  },
  buttonText: {
    fontSize: 19,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
});

export default SavedListDetails;
