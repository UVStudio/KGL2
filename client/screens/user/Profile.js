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

import { FORM_INPUT_UPDATE, PASSWORD_INPUT_UPDATE } from '../../store/types';

const formReducer = (state, action) => {
  if (
    action.type === FORM_INPUT_UPDATE ||
    action.type === PASSWORD_INPUT_UPDATE
  ) {
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
  const [message, setMessage] = useState(null);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
    },
    inputValidities: {
      name: false,
      email: false,
    },
    formIsValid: false,
  });

  const [passwordFormState, dispatchPasswordFormState] = useReducer(
    formReducer,
    {
      inputValues: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      inputValidities: {
        oldPassword: false,
        newPassword: false,
        confirmNewPassword: false,
      },
      formIsValid: false,
    }
  );

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

  useEffect(() => {
    if (message) {
      Alert.alert('Note', message, [{ text: 'Okay' }]);
    }
  }, [message]);

  const profileUpdateHandler = async () => {
    setError(null);
    setIsProfileUpdating(true);
    try {
      await dispatch(
        userActions.updateProfile(
          formState.inputValues.name,
          formState.inputValues.email
        )
      );
      if (!error) {
        Alert.alert('Profile updated', null, [{ text: 'Okay' }]);
      }
    } catch (err) {
      setError(err.message);
    }
    setIsProfileUpdating(false);
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

  const passwordInputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchPasswordFormState({
        type: PASSWORD_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchPasswordFormState]
  );

  //regex for min 8, max 15, 1 lower, 1 upper, 1 num
  const pwRegex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,15})');
  //'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})'

  const passwordUpdateHandler = async () => {
    setError(null);
    setMessage(null);
    setIsPasswordUpdating(true);
    if (
      passwordFormState.inputValues.newPassword !==
      passwordFormState.inputValues.confirmNewPassword
    ) {
      setError('Please make sure your new password inputs are identical.');
      setIsPasswordUpdating(false);
      return;
    }

    if (!pwRegex.test(passwordFormState.inputValues.newPassword)) {
      setIsPasswordUpdating(false);
      Alert.alert(
        'We need a strong Password',
        'Please make sure your password is between 8 and 15 characters, with at least 1 uppercase letter, 1 lowercase letter and  1 number.',
        [{ text: 'Okay' }]
      );
      return;
    }

    try {
      await dispatch(userActions.updatePassword(passwordFormState.inputValues));
      setMessage('Password Updated.');
    } catch (err) {
      setIsPasswordUpdating(false);
      setError(err.message);
    }
    setIsPasswordUpdating(false);
    setMessage(null);
  };

  const logOutHandler = async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await dispatch(authActions.logout());
    } catch (err) {
      setError(err.message);
    }
  };

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
            {isProfileUpdating ? (
              <View style={{ marginVertical: 20, width: 240 }}>
                <CustomButton color={Colors.greenText}>
                  <Text style={styles.buttonText}>Saving Profile...</Text>
                </CustomButton>
              </View>
            ) : (
              <View style={{ marginVertical: 20, width: 240 }}>
                <CustomButton
                  color={Colors.greenText}
                  onSelect={profileUpdateHandler}
                >
                  <Text style={styles.buttonText}>Save Profile</Text>
                </CustomButton>
              </View>
            )}
            <Text style={styles.profileLabel}>Update Password</Text>
            <Input
              id="oldPassword"
              label="current password"
              keyboardType="default"
              secureTextEntry
              minLength={8}
              autoCapitalize="none"
              errorText="Please enter current password"
              onInputChange={passwordInputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
              initiallyValid={!!user}
            />
            <Input
              id="newPassword"
              label="new password"
              keyboardType="default"
              secureTextEntry
              minLength={8}
              autoCapitalize="none"
              errorText="Please enter new password"
              onInputChange={passwordInputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
              initiallyValid={!!user}
            />
            <Input
              id="confirmNewPassword"
              label="confirm new password"
              keyboardType="default"
              secureTextEntry
              minLength={8}
              autoCapitalize="none"
              errorText="Please confirm new password"
              onInputChange={passwordInputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
              initiallyValid={!!user}
            />
            {isPasswordUpdating ? (
              <View style={{ marginVertical: 20, width: 240 }}>
                <CustomButton color={Colors.greenText}>
                  <Text style={styles.buttonText}>Updating...</Text>
                </CustomButton>
              </View>
            ) : (
              <View style={{ marginVertical: 20, width: 240 }}>
                <CustomButton
                  color={Colors.greenText}
                  onSelect={passwordUpdateHandler}
                >
                  <Text style={styles.buttonText}>Update Password</Text>
                </CustomButton>
              </View>
            )}
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
            {isLoggingOut ? (
              <View style={styles.buttonContainer}>
                <CustomButton color={Colors.greenText}>
                  <Text style={styles.buttonText}>Logging Out..</Text>
                </CustomButton>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <CustomButton
                  color={Colors.greenText}
                  onSelect={() => logOutHandler()}
                >
                  <Text style={styles.buttonText}>Logout</Text>
                </CustomButton>
              </View>
            )}
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
    width: 240,
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
