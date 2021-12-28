import React from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Colors from '../../constants/Colors';

const ContactUs = () => {
  let TouchableCmp = TouchableOpacity;

  Platform.OS === 'android' && Platform.Version >= 21
    ? (TouchableCmp = TouchableNativeFeedback)
    : TouchableOpacity;

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.heading}>Contact The Developer</Text>
        <Text>
          Hello, thank you for using my app. The best way to interact with me,
          the developer of this app, is through social media.
        </Text>
      </View>
      <View style={styles.socialsContainer}>
        <MaterialCommunityIcons
          name="facebook"
          size={65}
          color={Colors.facebook}
          style={styles.icon}
          onPress={() =>
            Linking.openURL('https://www.facebook.com/NordinKetoApp')
          }
        />
        <MaterialCommunityIcons
          name="instagram"
          size={65}
          color={Colors.instagram}
          style={styles.icon}
          onPress={() =>
            Linking.openURL('http://instagram.com/_u/nordinketoapp/')
          }
        />
        <MaterialCommunityIcons
          name="twitter"
          size={65}
          color={Colors.twitter}
          style={styles.icon}
          onPress={() => Linking.openURL('https://twitter.com/UV_Studio')}
        />
      </View>
      <View style={styles.footerContainer}>
        <Text>Nordin Keto App is developed by:</Text>
        <TouchableCmp
          onPress={() => Linking.openURL('https://www.uvstudio.ca')}
        >
          <Image
            source={require('../../assets/uv-logo.png')}
            style={styles.image}
          />
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '80%',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'open-sans-bold',
    marginVertical: 6,
    paddingTop: 5,
    fontSize: 20,
  },
  socialsContainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
  icon: {
    margin: 10,
  },
  footerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    marginTop: 15,
    width: 230,
    height: 75,
  },
});

export default ContactUs;

//linking notes:
//fb://page/PAGE_ID
//https://www.facebook.com/leonard.shen.1/
//106508011396370
//https://www.facebook.com/Nordin-Keto-App-106508011396370
//onPress={() => Linking.openURL('fb://page/106508011396370')}
