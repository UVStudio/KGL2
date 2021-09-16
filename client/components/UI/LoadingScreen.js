import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = (props) => {
  return (
    <View style={{ ...styles.screen, ...props.style }}>
      <Image
        style={{ width: 200, height: 200, marginBottom: 20 }}
        source={require('../../assets/nordin-round-tp.png')}
      />
      <ActivityIndicator size="large" color="#ccc" />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default LoadingScreen;
