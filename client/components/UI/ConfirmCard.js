import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const ConfirmCard = (props) => {
  const { text, toShow, toError } = props;

  const dispatch = useDispatch();

  const deleteUserHandler = async () => {
    toShow('');
    try {
      await dispatch(authActions.deleteCurrentUser());
    } catch (err) {
      console.log(err.message);
      toError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <Pressable onPress={() => toShow('')}>
          <Text style={styles.textBold}>Nevermind!</Text>
        </Pressable>
        <Pressable onPress={() => deleteUserHandler()}>
          <Text style={styles.textBoldRed}>YES. DELETE MY ACCOUNT.</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '86%',
    backgroundColor: '#fff',
    opacity: 1,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: Colors.red,
    //iOS shadow
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    //android shadow
    elevation: 10,
    shadowColor: '#000000',
  },
  innerContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'open-sans',
  },
  textBold: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    color: '#444',
    marginVertical: 12,
  },
  textBoldRed: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
    color: Colors.red,
    marginVertical: 12,
  },
});

export default ConfirmCard;
