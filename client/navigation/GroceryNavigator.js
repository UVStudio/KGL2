import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Auth from '../screens/user/Auth';
import ForgotPassword from '../screens/user/ForgotPassword';
import Profile from '../screens/user/Profile';
import Verification from '../screens/user/Verification';
import SavedLists from '../screens/grocery/SavedLists';
import SavedListDetails, {
  savedListDetailsScreenOptions,
} from '../screens/grocery/SavedListDetails';
import CurrentList from '../screens/grocery/CurrentList';
import ContactUs from '../screens/info/ContactUs';
import FoodGroups from '../screens/info/FoodGroups';
import FoodGroupItems, {
  foodGroupItemsScreenOptions,
} from '../screens/info/FoodGroupItems';
import FavFoods from '../screens/grocery/FavFoods';
import FoodDetails, {
  foodDetailsScreenOptions,
} from '../screens/info/FoodDetails';

import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: 'nordin-regular',
    fontSize: 40,
  },
  headerBackTitleStyle: {
    fontFamily: 'nordin-regular',
    fontSize: 28,
  },
  headerBackTitle: '',
  headerTintColor: 'white',
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={Auth}
        options={{ headerTitle: 'Login / Register' }}
      />
      <AuthStackNavigator.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerTitle: 'Forgot Password' }}
      />
      <AuthStackNavigator.Screen name="Profile" component={Profile} />
      <AuthStackNavigator.Screen name="Verification" component={Verification} />
    </AuthStackNavigator.Navigator>
  );
};

const CurrentListStackNavigator = createStackNavigator();

export const CurrentListNavigator = () => {
  return (
    <CurrentListStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <CurrentListStackNavigator.Screen
        name="Current List"
        component={CurrentList}
        options={{ headerTitle: 'Grocery List' }}
      />
      <CurrentListStackNavigator.Screen
        name="Saved Lists"
        component={SavedLists}
      />
      <CurrentListStackNavigator.Screen
        name="Saved List Details"
        component={SavedListDetails}
        options={savedListDetailsScreenOptions}
      />
      <CurrentListStackNavigator.Screen
        name="Food Details"
        component={FoodDetails}
      />
    </CurrentListStackNavigator.Navigator>
  );
};

const FoodGroupsStackNavigator = createStackNavigator();

export const FoodGroupsNavigator = () => {
  return (
    <FoodGroupsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <FoodGroupsStackNavigator.Screen
        name="Food Groups"
        component={FoodGroups}
      />
      <FoodGroupsStackNavigator.Screen
        name="Food Group Items"
        component={FoodGroupItems}
        options={foodGroupItemsScreenOptions}
      />
      <FoodGroupsStackNavigator.Screen
        name="Food Details"
        component={FoodDetails}
        options={foodDetailsScreenOptions}
      />
    </FoodGroupsStackNavigator.Navigator>
  );
};

const FavFoodsStackNavigator = createStackNavigator();

export const FavFoodsNavigator = () => {
  return (
    <FavFoodsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <FavFoodsStackNavigator.Screen
        name="Favourite Foods"
        component={FavFoods}
      />
      <FavFoodsStackNavigator.Screen
        name="Food Details"
        component={FoodDetails}
        options={foodDetailsScreenOptions}
      />
    </FavFoodsStackNavigator.Navigator>
  );
};

const ProfileStackNavigator = createStackNavigator();

export const ProfileNavigator = () => {
  return (
    <ProfileStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfileStackNavigator.Screen name="Profile" component={Profile} />
      <ProfileStackNavigator.Screen name="Contact Us" component={ContactUs} />
    </ProfileStackNavigator.Navigator>
  );
};

const GroceryBottomTabNavigator = createBottomTabNavigator();

const bottomTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    let iconName;

    if (route.name === "Today's List") {
      iconName = focused ? 'format-list-checks' : 'format-list-checkbox';
    } else if (route.name === 'Food Groups') {
      iconName = focused ? 'food-drumstick' : 'food-drumstick-outline';
    } else if (route.name === 'Favourites') {
      iconName = focused ? 'heart-multiple' : 'heart-multiple-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'account' : 'account-outline';
    }

    return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
  },
});

export const BottomTabNavigator = () => {
  return (
    <GroceryBottomTabNavigator.Navigator
      screenOptions={bottomTabOptions}
      tabBarOptions={{
        activeTintColor: Colors.greenText,
        inactiveTintColor: 'gray',
        labelPosition: 'below-icon',
        style:
          Platform.OS === 'android'
            ? { paddingBottom: 4, paddingTop: 3 }
            : { paddingTop: 6 },
      }}
    >
      <GroceryBottomTabNavigator.Screen
        name="Today's List"
        component={CurrentListNavigator}
      />
      <GroceryBottomTabNavigator.Screen
        name="Food Groups"
        component={FoodGroupsNavigator}
      />
      <GroceryBottomTabNavigator.Screen
        name="Favourites"
        component={FavFoodsNavigator}
      />
      <GroceryBottomTabNavigator.Screen
        name="Profile"
        component={ProfileNavigator}
      />
    </GroceryBottomTabNavigator.Navigator>
  );
};
