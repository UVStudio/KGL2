import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AuthNavigator } from './GroceryNavigator';
import { BottomTabNavigator } from '../navigation/GroceryNavigator';
import Startup from '../screens/Startup';

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <BottomTabNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <Startup />}
    </NavigationContainer>
  );
};

export default AppNavigator;
