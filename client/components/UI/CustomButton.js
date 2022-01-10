import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const CustomButton = (props) => {
  return (
    <View style={styles.shadow}>
      <Pressable style={styles.customButton} onPress={props.onSelect}>
        {props.children}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  customButton: {
    backgroundColor: Colors.primary,
    marginVertical: 5,
    width: '100%',
    borderRadius: 12,
    shadowColor: '#888',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  shadow: {
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
});

export default CustomButton;
