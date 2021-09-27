import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Card from './Card';

const windowWidth = Dimensions.get('window').width;

const dynamicCardWidth = () => {
  if (windowWidth > 600) {
    return windowWidth * 0.6;
  } else {
    return windowWidth * 0.9;
  }
};

const dynamicCardHeight = () => {
  if (windowWidth > 600) {
    return 500;
  } else {
    return 340;
  }
};

const FoodCard = (props) => {
  const favFoods = useSelector((state) => state.foods.favFoods);
  let favOrNot = false;

  if (favFoods.includes(props.id)) {
    favOrNot = true;
  }

  let TouchableCmp = TouchableOpacity;

  Platform.OS === 'android' && Platform.Version >= 21
    ? (TouchableCmp = TouchableNativeFeedback)
    : TouchableOpacity;

  return (
    <Card style={styles.foodGroup}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <ImageBackground
                style={styles.image}
                source={{ uri: props.image }}
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
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

console.log('width: ', windowWidth);
console.log('dyn width: ', dynamicCardWidth());

const styles = StyleSheet.create({
  foodGroup: {
    height: dynamicCardHeight(),
    width: dynamicCardWidth(),
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: dynamicCardHeight() * 0.85,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    alignItems: 'center',
    height: 50,
    padding: 5,
  },
  title: {
    fontFamily: 'nordin-regular',
    fontSize: 35,
    marginVertical: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '25%',
    paddingHorizontal: 20,
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

export default FoodCard;
