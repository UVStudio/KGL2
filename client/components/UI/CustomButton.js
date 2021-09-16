import React from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

const CustomButton = (props) => {
  let TouchableCmp = TouchableOpacity;

  Platform.OS === 'android' && Platform.Version >= 21
    ? (TouchableCmp = TouchableNativeFeedback)
    : TouchableOpacity;

  return (
    <View style={styles.shadow}>
      <LinearGradient
        style={styles.customButton}
        colors={[Colors.greenMedium, Colors.greenText]}
        locations={[0, 0.5]}
      >
        <TouchableCmp style={{ ...props.style }} onPress={props.onSelect}>
          {props.children}
        </TouchableCmp>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  customButton: {
    borderRadius: 12,
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  shadow: {
    shadowColor: '#888',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
});

export default CustomButton;
