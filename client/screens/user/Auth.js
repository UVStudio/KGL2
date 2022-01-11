import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/UI/LoadingScreen';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import CustomButton from '../../components/UI/CustomButton';
import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const Auth = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [isSignup, setIsSignup] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
      password: '',
      password2: '',
    },
    inputValidities: {
      name: false,
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  //regex for min 8, max 15, 1 lower, 1 upper, 1 num, 1 special
  // const pwRegex = new RegExp(
  //   /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[^a-zA-Z0-9])(?!.*\s).{8,15}$/
  // );
  const pwRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,15})');

  const authHandler = async () => {
    let action;
    if (isSignup) {
      if (formState.inputValues.password !== formState.inputValues.password2) {
        Alert.alert(
          'Password Invalid',
          'Please make sure your confirm password is identical to your password',
          [{ text: 'Okay' }]
        );
        return;
      }

      if (!pwRegex.test(formState.inputValues.password)) {
        Alert.alert(
          'We need a strong Password',
          'Please make sure your password has at least 8 and fewer than 16 characters, 1 uppercase letter, 1 lowercase letter and 1 number.',
          [{ text: 'Okay' }]
        );
        return;
      }

      setIsRegistering(true);
      action = authActions.register(
        formState.inputValues.name,
        formState.inputValues.email.toLowerCase(),
        formState.inputValues.password
      );
    } else {
      setIsLogging(true);
      action = authActions.login(
        formState.inputValues.email.toLowerCase(),
        formState.inputValues.password
      );
    }
    setError(null);
    setIsRegistering(false);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLogging(false);
      setIsRegistering(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LoadingScreen />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/kgl-bg.jpg')}
      resizeMode="cover"
      style={styles.image}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={15}
        style={styles.screen}
      >
        <Card style={styles.authContainer}>
          <ScrollView style={styles.scrollView}>
            {isSignup ? (
              <Input
                id="name"
                label="name"
                keyboardType="default"
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            ) : null}
            <Input
              id="email"
              label="e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
            <Input
              id="password"
              label="password"
              keyboardType="default"
              secureTextEntry
              autoCapitalize="none"
              minLength={6}
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
            {isSignup ? (
              <Input
                id="password2"
                label="confirm password"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                minLength={6}
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
            ) : null}
            <View style={styles.buttonGroupContainer}>
              <View style={styles.buttonContainer}>
                <CustomButton onSelect={authHandler}>
                  <Text style={styles.buttonText}>
                    {isSignup
                      ? isRegistering
                        ? 'Registering...'
                        : 'Register'
                      : isLogging
                      ? 'Logging in..'
                      : 'Login'}
                  </Text>
                </CustomButton>
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  onSelect={() => setIsSignup((prevState) => !prevState)}
                >
                  <Text style={styles.buttonText}>{`Switch to ${
                    isSignup ? 'Login' : 'Register'
                  }`}</Text>
                </CustomButton>
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="Forgot Password"
                  onSelect={() => props.navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.buttonText}>Forgot Password</Text>
                </CustomButton>
              </View>
            </View>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: 600,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    width: '80%',
  },
  textInput: {
    height: 22,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  buttonGroupContainer: {
    marginTop: 15,
  },
  buttonContainer: {
    marginVertical: 3,
  },
  buttonText: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
    color: 'white',
  },
});

export default Auth;
