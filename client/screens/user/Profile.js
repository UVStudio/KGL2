import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import LoadingScreen from '../../components/UI/LoadingScreen';
import CustomButton from '../../components/UI/CustomButton';
import Input from '../../components/UI/Input';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';

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

const Profile = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
      password: '',
    },
    inputValidities: {
      name: false,
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    const getUser = async () => {
      await dispatch(userActions.getUser());
      setIsLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const profileUpdateHandler = async () => {
    setError(null);
    try {
      await dispatch(
        userActions.updateProfile(
          formState.inputValues.name,
          formState.inputValues.email,
          formState.inputValues.password
        )
      );
      if (!error) {
        Alert.alert('Profile updated', null, [{ text: 'Okay' }]);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={15}
      style={styles.screen}
    >
      <View style={{ alignItems: 'center' }}>
        <ScrollView style={{ width: '80%', marginVertical: 15 }}>
          <View style={styles.container}>
            <Text style={styles.profileLabel}>Update Profile</Text>
            <Input
              id="name"
              label="name"
              keyboardType="default"
              autoCapitalize="none"
              errorText="Please enter name"
              onInputChange={inputChangeHandler}
              initialValue={user ? user.name : null}
              initiallyValid={!!user}
            />
            <Input
              id="email"
              label="e-mail"
              keyboardType="email-address"
              email
              autoCapitalize="none"
              errorText="Please enter valid email address"
              onInputChange={inputChangeHandler}
              initialValue={user ? user.email : null}
              initiallyValid={!!user}
            />
            <Input
              id="password"
              label="password"
              keyboardType="default"
              secureTextEntry
              minLength={6}
              autoCapitalize="none"
              errorText="Please enter password"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
              initiallyValid={!!user}
            />
            <View style={{ marginVertical: 20, width: 200 }}>
              <CustomButton
                color={Colors.greenText}
                onSelect={profileUpdateHandler}
              >
                <Text style={styles.buttonText}>Save Profile</Text>
              </CustomButton>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <CustomButton
                color={Colors.greenText}
                onSelect={() => {
                  props.navigation.navigate('Contact Us');
                }}
              >
                <Text style={styles.buttonText}>Contact Us</Text>
              </CustomButton>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                color={Colors.greenText}
                onSelect={() => {
                  dispatch(authActions.logout());
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </CustomButton>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    width: '80%',
    marginVertical: 20,
  },
  profileLabel: {
    fontFamily: 'open-sans-bold',
    marginVertical: 10,
    fontSize: 20,
    alignSelf: 'center',
  },
  line: {
    width: '100%',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingBottom: 12,
  },
  profileText: {
    fontSize: 18,
    fontFamily: 'open-sans',
  },
  buttonContainer: {
    width: 200,
    marginVertical: 4,
  },
  container: {
    width: 300,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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

export default Profile;
