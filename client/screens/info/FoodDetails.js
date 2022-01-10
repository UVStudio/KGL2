import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PieChart } from 'react-native-svg-charts';
import * as svg from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as foodActions from '../../store/actions/foods';
import CustomButton from '../../components/UI/CustomButton';
import Colors from '../../constants/Colors';

const windowWidth = Dimensions.get('window').width;

const dynamicDeviceWidth = () => {
  if (windowWidth > 600) {
    return windowWidth * 0.6;
  } else {
    return windowWidth;
  }
};

const FoodDetails = (props) => {
  const [toReload, setToReLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const foodName = props.route.params.name;
  const selectedFood = useSelector((state) =>
    state.foods.foods.find((food) => food.name === foodName)
  );
  const favFoods = useSelector((state) => state.foods.favFoods);
  const currentListId = useSelector((state) => state.foods.currentListId);
  const mutableGroceryLists = useSelector(
    (state) => state.foods.mutableGroceryLists
  );

  const currentList = mutableGroceryLists.find(
    (list) => list._id === currentListId
  );

  let favOrNot = false;
  let onListOrNot = false;

  if (favFoods.includes(selectedFood._id)) {
    favOrNot = true;
  }

  if (currentList.groceryListArray.includes(selectedFood._id)) {
    onListOrNot = true;
  }

  const dispatch = useDispatch();

  const favHandler = async (id) => {
    setError(null);

    setIsLoading(true);
    try {
      if (!favOrNot) {
        await dispatch(foodActions.addFav(id));
      } else {
        await dispatch(foodActions.deleteFav(id));
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const addFoodToCurrMutableListHandler = (lists, currentList, foodId) => {
    dispatch(foodActions.addFoodToCurrMutableList(lists, currentList, foodId));
    setToReLoad((prevState) => !prevState);
    props.navigation.navigate('Current List', {
      mutableGroceryLists,
    });
  };

  const data = [
    {
      key: 1,
      name: 'protein',
      amount: selectedFood.protein,
      split: selectedFood.macrosSplit.protein,
      svg: { fill: Colors.purple },
    },
    {
      key: 2,
      name: 'fats',
      amount: selectedFood.fats,
      split: selectedFood.macrosSplit.fats,
      svg: { fill: Colors.pink },
    },
    {
      key: 3,
      name: 'fiber',
      amount: selectedFood.fiber,
      split: selectedFood.macrosSplit.fiber,
      svg: { fill: Colors.green },
    },
    {
      key: 4,
      name: 'net carbs',
      amount: selectedFood.netCarbs,
      split: selectedFood.macrosSplit.netCarbs,
      svg: { fill: Colors.orange },
    },
  ];

  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <svg.Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={'white'}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
          fontSize={19}
        >
          {data.split > 0.05 ? data.amount + `g` : null}
        </svg.Text>
      );
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

  return (
    <View style={styles.foodContainer}>
      <ScrollView style={{ width: dynamicDeviceWidth() }}>
        <ImageBackground
          style={styles.image}
          source={{ uri: selectedFood.imageUrl }}
        >
          {favOrNot ? (
            <MaterialCommunityIcons
              name="heart"
              size={42}
              color={Colors.red}
              style={styles.heart}
            />
          ) : null}
        </ImageBackground>
        <View style={styles.action}>
          <Text style={styles.title}>{foodName}</Text>
          <View style={{ marginTop: 12, width: '80%' }}>
            {!isLoading ? (
              <CustomButton onSelect={() => favHandler(selectedFood._id)}>
                <Text style={styles.buttonText}>
                  {favOrNot ? 'Remove from favourites' : 'Add to favourites'}
                </Text>
              </CustomButton>
            ) : (
              <View
                style={{
                  height: 40.5,
                }}
              >
                <ActivityIndicator size="small" color="#555" top={10} />
              </View>
            )}
          </View>
          {!onListOrNot ? (
            <View style={{ width: '80%' }}>
              <CustomButton
                onSelect={() =>
                  addFoodToCurrMutableListHandler(
                    mutableGroceryLists,
                    currentList,
                    selectedFood._id
                  )
                }
              >
                <Text style={styles.buttonText}>
                  Add to today's grocery list
                </Text>
              </CustomButton>
            </View>
          ) : null}
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendInnerContainer}>
            <View style={styles.legendRow}>
              <View style={styles.macroContainer}>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={35}
                  color={Colors.purple}
                />
                <Text style={styles.macroText}>Protein</Text>
              </View>
              <View style={styles.macroContainer}>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={35}
                  color={Colors.pink}
                />
                <Text style={styles.macroText}>Fats</Text>
              </View>
            </View>
            <View style={styles.legendRow}>
              <View style={styles.macroContainer}>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={35}
                  color={Colors.green}
                />
                <Text style={styles.macroText}>Fiber</Text>
              </View>
              <View style={styles.macroContainer}>
                <MaterialCommunityIcons
                  name="rectangle"
                  size={35}
                  color={Colors.orange}
                />
                <Text style={styles.macroText}>Net Carbs</Text>
              </View>
            </View>
          </View>
          <Text style={styles.macroText}>per 100 grams weight</Text>
        </View>
        <PieChart
          style={{ height: 250, marginVertical: 12, marginBottom: 20 }}
          valueAccessor={({ item }) => item.amount}
          data={data}
          spacing={1}
          outerRadius={'95%'}
        >
          <Labels />
        </PieChart>
      </ScrollView>
    </View>
  );
};

export const foodDetailsScreenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.name,
  };
};

const styles = StyleSheet.create({
  foodContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: (dynamicDeviceWidth() * 3) / 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  action: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'nordin-regular',
    fontSize: 35,
    marginVertical: 1,
  },
  legendContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  legendInnerContainer: {
    width: 250,
  },
  legendRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  macroContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  macroText: {
    top: 7,
    paddingLeft: 5,
    fontFamily: 'open-sans',
    fontSize: 18,
  },
  buttonText: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
  heart: {
    top: 10,
    alignSelf: 'flex-end',
    left: -10,
    shadowColor: '#bbb',
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 1,
    elevation: 2,
  },
});

export default FoodDetails;
