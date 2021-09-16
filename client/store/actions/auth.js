import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTHENTICATE,
  SET_DID_TRY_AL,
  LOGOUT,
  FORGOT_PASSWORD,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs';

let timer;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token, userId });
  };
};

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const register = (name, email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/register`,
        body,
        config
      );

      const resData = response.data;
      await dispatch(authenticate(resData.token, resData.user._id, oneMonth));
      const expirationDate = resData.options.expires;
      await saveDataToStorage(resData.token, resData.user._id, expirationDate);
      await initialGroceryList([], 'grocery list');
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/login`,
        body,
        config
      );

      const resData = response.data;
      dispatch(authenticate(resData.token, resData.user._id, oneMonth));
      const expirationDate = resData.options.expires;
      saveDataToStorage(resData.token, resData.user._id, expirationDate);
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const forgotPassword = (email) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email });
    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/forgotpassword`,
        body,
        config
      );
      const veriCode = response.data.data;

      dispatch({
        type: FORGOT_PASSWORD,
        code: veriCode,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const resetPassword = (veriCode, password) => {
  return async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ password });

    try {
      const response = await axios.post(
        `${CURRENT_IP}/api/auth/verificationcode/${veriCode}`,
        body,
        config
      );

      const resData = response.data;
      dispatch(authenticate(resData.token, resData.user._id, oneMonth));
      const expirationDate = resData.options.expires;
      saveDataToStorage(resData.token, resData.user._id, expirationDate);
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

/** UTILS */
const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate,
    })
  );
};

export const initialGroceryList = async (foods, name) => {
  const body = JSON.stringify({ foods, name });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await axios.post('http://192.168.0.197:5000/api/groceryList/', body, config);
};
