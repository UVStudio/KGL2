import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  Alert,
  Animated,
  LayoutAnimation,
  UIManager,
  Modal,
  KeyboardAvoidingView,
  useWindowDimensions,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

import CustomButton from '../../components/UI/CustomButton';
import LoadingScreen from '../../components/UI/LoadingScreen';
import * as foodsActions from '../../store/actions/foods';
import Colors from '../../constants/Colors';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CurrentList = (props) => {
  const foods = useSelector((state) => state.foods.foods);
  const groceryLists = useSelector((state) => state.foods.groceryLists);
  let mutableGroceryLists = useSelector(
    (state) => state.foods.mutableGroceryLists
  );

  const fadeAnimation = (duration) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        duration,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = (duration) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  let listLoaded;

  const dispatch = useDispatch();

  //which route.params should component use
  if (props.route.params) {
    if (props.route.params.listId) {
      listLoaded = props.route.params;
    } else if (props.route.params.mutableGroceryLists) {
      mutableGroceryLists = mutableGroceryLists;
    }
  }

  const [search, setSearch] = useState('');
  const [bottomButtons, setBottomButtons] = useState(true);
  const [foodSelection, setFoodSelection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(undefined);
  const [toReload, setToReLoad] = useState(false);
  const [fadedItems, setFadedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [listName, setListName] = useState(null);

  const windowHeight = useWindowDimensions().height;

  const loadData = async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(foodsActions.getFoods());
      await dispatch(foodsActions.getFavs());
      await dispatch(foodsActions.getSavedLists());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadData().then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let options;
    if (search.length === 0) {
      options = '';
      fadeAnimation(250);
      setFoodSelection(options);
    }
    if (search.length > 2) {
      options = foods.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
      );
      fadeIn(300);
      fadeAnimation(250);
      setFoodSelection(options);
    }
  }, [search]);

  /** Main Logic To Load Grocery List*/
  let loadedFoodsList;
  let lastModifiedList;
  let listFoods = []; //listFoods will depend on whether a saved list (listLoaded) is chosen
  let listFoodsName;
  let listFoodsId;
  let foodItemsData = []; //data for Flatlist in JSX

  //look for the latest lastModified grocery list
  const sortLastModified = (lists) => {
    for (let i = 0; i < lists.length - 1; i++) {
      for (let j = 0; j < lists.length - 1; j++) {
        if (lists[j].lastModifiedAt < lists[j + 1].lastModifiedAt) {
          [lists[j + 1], lists[j]] = [lists[j], lists[j + 1]];
        }
      }
    }
    return lists[0];
  };

  if (listLoaded && !isLoading) {
    loadedFoodsList = mutableGroceryLists.find(
      (list) => list._id === listLoaded.listId
    );
    listFoods = loadedFoodsList.groceryListArray; //if user loads a saved list
    listFoodsName = loadedFoodsList.name;
    listFoodsId = loadedFoodsList._id;
  } else if (!listLoaded && !isLoading) {
    lastModifiedList = sortLastModified(mutableGroceryLists);
    listFoods = lastModifiedList.groceryListArray; //default list - user's latest modified list
    listFoodsName = lastModifiedList.name;
    listFoodsId = lastModifiedList._id;
  }

  useEffect(() => {
    if (listFoodsId) {
      dispatch(foodsActions.setCurrentList(listFoodsId));
    }
  }, [listFoodsId]);

  useEffect(() => {
    if (listLoaded) {
      setFadedItems([]);
    }
  }, [listLoaded]);

  useEffect(() => {
    //Keyboard.addListener('keyboardDidShow', console.log('add did show'));
    Keyboard.addListener('keyboardDidHide', () => {
      setBottomButtons(true);
    });

    // cleanup function
    return () => {
      Keyboard.removeAllListeners('keyboardDidHide', () => {
        setBottomButtons(true);
      });
    };
  }, [Keyboard]);

  const foodItemsDataFn = (list, foods) => {
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < foods.length; j++) {
        if (list[i] === foods[j]._id) {
          foodItemsData.push(foods[j]);
        }
      }
      if (foodItemsData.length === list.length) return;
    }
  };

  foodItemsDataFn(listFoods, foods);

  /** End of Main Logic */

  const selectFoodDetailsHandler = (name) => {
    props.navigation.navigate('Food Details', {
      name,
    });
  };

  const searchHandler = (food) => {
    setBottomButtons(false);
    setSearch(food);
  };

  const addToListHandler = (food) => {
    if (listFoods.includes(food._id)) {
      Alert.alert(
        'Notice',
        'You already have this on your list',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: true }
      );
      return;
    }
    fadeAnimation(400);
    listFoods.unshift(food._id);
    setSearch('');
  };

  const removeFromListHandler = (foodName) => {
    const foodIdToLocate = foods.find((food) => food.name === foodName);
    const index = listFoods.indexOf(foodIdToLocate._id);
    fadeAnimation(300);
    listFoods.splice(index, 1);
    setToReLoad((prevState) => !prevState);
  };

  const addFoodToFadedHandler = (foodName) => {
    const foodIdToLocate = foods.find((food) => food.name === foodName);
    setFadedItems((fadedItems) => [...fadedItems, foodIdToLocate._id]);
    fadedItems.push(foodIdToLocate._id);
  };

  const removeFoodFromFadedHandler = (foodName) => {
    const foodIdToLocate = foods.find((food) => food.name === foodName);
    setFadedItems((fadedItems) =>
      fadedItems.filter((item) => item !== foodIdToLocate._id)
    );
  };

  const updateExistingListHandler = async (foods, name, id) => {
    try {
      setIsLoading(true);
      await dispatch(foodsActions.updateExistingList(foods, name, id));
      await dispatch(foodsActions.getSavedLists());
      setToReLoad((prevState) => !prevState);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const saveNewListHandler = async (foods, name) => {
    //need to empty listLoaded if user is saving a new list,
    //so the default would go to the latest modified list
    listLoaded = null;
    const date = Date.now();
    const dateInterm = new Date(date);
    const dateString = dateInterm.toLocaleDateString();
    if (!name) {
      name = dateString;
    }
    try {
      setIsLoading(true);
      await dispatch(foodsActions.saveNewList(foods, name));
      await dispatch(foodsActions.getSavedLists());
      setToReLoad((prevState) => !prevState);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  //listName would be null if user doesn't change list name input field
  let listNameToBeUpdated;
  if (!listName) {
    listNameToBeUpdated = listFoodsName;
  } else {
    listNameToBeUpdated = listName;
  }

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={15}
      style={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchLabel}>Search Food</Text>
          <View style={styles.searchLabelContainer}>
            <TextInput
              keyboardType="default"
              autoCapitalize="none"
              maxLength={25}
              value={search}
              onTouchEnd={() => setBottomButtons(false)}
              onChangeText={(value) => searchHandler(value)}
              style={styles.searchTextInput}
            />
            {search ? (
              <Entypo
                name="erase"
                style={{ left: -26, color: '#555' }}
                size={25}
                onPress={() => setSearch('')}
              />
            ) : null}
          </View>

          <View style={styles.searchOptionsContainer}>
            <Animated.ScrollView style={{ opacity: fadeAnim }}>
              {foodSelection
                ? foodSelection.map((food) => (
                    <Animated.View
                      key={food._id}
                      style={(styles.searchOptions, { opacity: fadeAnim })}
                    >
                      <Text
                        style={styles.searchOptionsText}
                        onPress={() => addToListHandler(food)}
                      >
                        {food.name}
                      </Text>
                    </Animated.View>
                  ))
                : null}
            </Animated.ScrollView>
          </View>
        </View>
        <View
          style={[
            styles.groceryList,
            {
              maxHeight:
                windowHeight > 900
                  ? windowHeight * 0.7
                  : windowHeight < 660
                  ? windowHeight * 0.48
                  : windowHeight * 0.56,
            },
          ]}
          //onTouchEnd={() => setBottomButtons(true)}
        >
          <Text style={styles.listHeader}>{listFoodsName}</Text>
          <View style={styles.line}></View>
          {foodItemsData.length > 0 ? (
            <FlatList
              data={foodItemsData}
              keyExtractor={(item) => item._id}
              renderItem={(itemData) => (
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}
                >
                  <View
                    style={
                      fadedItems.includes(itemData.item._id)
                        ? styles.listItemContainerGrey
                        : styles.listItemContainerWhite
                    }
                  >
                    <View style={{ flex: 1 }}>
                      <MaterialIcons
                        name="local-grocery-store"
                        style={{ opacity: 1, top: -1 }}
                        color={Colors.blue}
                        size={28}
                        onPress={() => {
                          fadedItems.includes(itemData.item._id)
                            ? removeFoodFromFadedHandler(itemData.item.name)
                            : addFoodToFadedHandler(itemData.item.name);
                        }}
                      />
                    </View>

                    <View style={{ flex: 5 }}>
                      <Text
                        style={styles.listText}
                        onPress={() =>
                          selectFoodDetailsHandler(itemData.item.name)
                        }
                      >
                        {itemData.item.name}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Ionicons
                        name="trash-outline"
                        style={{ opacity: 1, left: 10 }}
                        color={Colors.brown}
                        size={28}
                        onPress={() =>
                          removeFromListHandler(itemData.item.name)
                        }
                      />
                    </View>
                  </View>
                </Animated.View>
              )}
            />
          ) : (
            <View style={styles.noFoodsContainer}>
              <Text style={styles.noFoods}>
                This list has no foods at the moment. You can search for Keto
                foods from the above 'Search' function, or you can browse
                through our foods under 'Food Groups' and find foods to add to
                this list.
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomSection}>
        {bottomButtons ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              color={Colors.greenText}
              onSelect={() => {
                setModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Save List</Text>
            </CustomButton>
            <CustomButton
              color={Colors.greenText}
              onSelect={() => {
                props.navigation.navigate('Saved Lists');
              }}
            >
              <Text style={styles.buttonText}>Load Lists</Text>
            </CustomButton>
          </View>
        ) : null}
      </View>
      <View style={styles.centered}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centered}>
            <View style={styles.modalView}>
              <Text style={styles.modalLabel}>Save your list</Text>
              <TextInput
                id="listName"
                keyboardType="default"
                autoCapitalize="none"
                fontFamily="open-sans"
                defaultValue={listFoodsName}
                value={listName}
                maxLength={25}
                onChangeText={(text) => setListName(text)}
                style={styles.searchTextInput}
              />
              <View style={styles.modalButtonContainer}>
                <CustomButton
                  color={Colors.greenText}
                  onSelect={() => {
                    updateExistingListHandler(
                      foodItemsData,
                      listNameToBeUpdated,
                      listFoodsId
                    );
                    setModalVisible(!modalVisible);
                    setListName(null);
                  }}
                >
                  <Text style={styles.smallButtonText}>Save</Text>
                </CustomButton>
                {groceryLists.length < 10 ? (
                  <CustomButton
                    color={Colors.greenText}
                    onSelect={() => {
                      saveNewListHandler(foodItemsData, listName);
                      setModalVisible(!modalVisible);
                      setListName(null);
                    }}
                  >
                    <Text style={styles.smallButtonText}>Save as</Text>
                  </CustomButton>
                ) : null}
                <CustomButton
                  color={Colors.greenText}
                  onSelect={() => {
                    setModalVisible(!modalVisible);
                    setListName(null);
                  }}
                >
                  <Text style={styles.smallButtonText}>Cancel</Text>
                </CustomButton>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listText: {
    fontSize: 22,
    fontFamily: 'open-sans',
    color: '#111',
  },
  container: {
    flex: 4,
    width: 300,
    marginVertical: 18,
    position: 'absolute',
  },
  searchInputContainer: {
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    zIndex: 2,
    opacity: 0.98,
    alignContent: 'center',
  },
  searchLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
  },
  searchLabel: {
    fontFamily: 'open-sans-bold',
    marginVertical: 4,
    paddingTop: 5,
    fontSize: 17,
  },
  searchTextInput: {
    fontSize: 18,
    fontFamily: 'open-sans',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    paddingLeft: 4,
  },
  searchOptionsContainer: {
    maxHeight: 190,
    marginBottom: 12,
  },
  searchOptions: {
    fontFamily: 'open-sans',
  },
  searchOptionsText: {
    fontSize: 20,
    paddingTop: 3,
    paddingVertical: 2,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  groceryList: {
    zIndex: 0,
    position: 'absolute',
    top: 105,
  },
  listHeader: {
    marginBottom: 4,
    fontSize: 19,
    alignSelf: 'center',
    fontFamily: 'open-sans-bold',
  },
  line: {
    width: 300,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    marginBottom: 8,
  },
  listItemContainerGrey: {
    flex: 1,
    flexDirection: 'row',
    opacity: 0.15,
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 3,
  },
  listItemContainerWhite: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 3,
  },
  listItemContainerChecks: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    top: -4,
  },
  bottomSection: {
    height: 50,
    width: 300,
    position: 'absolute',
    bottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    zIndex: 1,
    width: '100%',
    opacity: 0.98,
    justifyContent: 'space-between',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalLabel: {
    fontSize: 15,
    fontFamily: 'open-sans-bold',
    marginVertical: 5,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    zIndex: 1,
    width: '100%',
    opacity: 0.98,
    marginTop: 12,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
  smallButtonText: {
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 9,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
  errorContainer: {
    width: 250,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
  noFoodsContainer: {
    width: 300,
    alignItems: 'center',
  },
  noFoods: {
    fontFamily: 'open-sans',
    fontSize: 18,
    color: 'black',
  },
});

export default CurrentList;
