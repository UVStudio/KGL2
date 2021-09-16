import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import LoadingScreen from '../../components/UI/LoadingScreen';
import Card from '../../components/UI/Card';
import CustomButton from '../../components/UI/CustomButton';
import * as authAction from '../../store/actions/auth';

const Verification = (props) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const veriCode = useSelector((state) => state.auth.veriCode);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const resetLoginHandler = async (code, password) => {
    if (password !== passwordConfirm) {
      Alert.alert(
        'Please make sure your password inputs are identical.',
        'Please try again.',
        [{ text: 'Okay' }]
      );
      return;
    }

    if (code !== veriCode) {
      Alert.alert('Your verification code is incorrect.', 'Please try again.', [
        { text: 'Okay' },
      ]);
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authAction.resetPassword(code, password));
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.instructionsContainer}>
        <Text style={styles.label}>Instructions</Text>
        <Text style={styles.instructions}>
          Enter the 4 digit verification code and your new password here.
        </Text>
      </View>
      <Card>
        <View style={styles.container}>
          <Text style={styles.label}>enter your verification code:</Text>
          <TextInput
            style={styles.emailInput}
            keyboardType="number-pad"
            autoCapitalize="none"
            required
            value={code}
            onChangeText={(value) => setCode(value)}
            maxLength={4}
          />
          <Text style={styles.label}>enter your new password:</Text>
          <TextInput
            style={styles.emailInput}
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry
            required
            value={password}
            onChangeText={(value) => setPassword(value)}
            minLength={6}
          />
          <Text style={styles.label}>confirm your new password:</Text>
          <TextInput
            style={styles.emailInput}
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry
            required
            value={passwordConfirm}
            onChangeText={(value) => setPasswordConfirm(value)}
            minLength={6}
          />
          <View style={styles.buttonContainer}>
            <CustomButton onSelect={() => resetLoginHandler(code, password)}>
              <Text style={styles.buttonText}>Reset Password</Text>
            </CustomButton>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  instructionsContainer: {
    width: '80%',
    marginVertical: 30,
    backgroundColor: '#fff',
  },
  instructions: {
    fontFamily: 'open-sans',
    fontSize: 16,
    marginVertical: 15,
  },
  container: {
    width: 250,
    marginHorizontal: 30,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 5,
  },
  emailInput: {
    fontSize: 20,
    fontFamily: 'open-sans',
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    paddingLeft: 4,
  },
  buttonContainer: {
    marginVertical: 10,
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

export default Verification;
