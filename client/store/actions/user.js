import axios from 'axios';
import { GET_USER, UPDATE_PROFILE } from '../types';
import { CURRENT_IP } from '../../serverConfigs';

export const getUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${CURRENT_IP}/api/auth/me`);
      if (!response) {
        throw new Error('You are not logged in');
      }

      const user = response.data.data;

      dispatch({
        type: GET_USER,
        user: user,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updateProfile = (name, email, password) => {
  return async (dispatch) => {
    try {
      const body = JSON.stringify({ name, email, password });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      await axios.put(`${CURRENT_IP}/api/auth/updatedetails`, body, config);

      dispatch({
        type: UPDATE_PROFILE,
        user: {
          name,
          email,
        },
      });
    } catch (err) {
      throw new Error('Update did not occurr due to an error');
    }
  };
};

export const updatePassword = (password) => {
  return async () => {
    const { oldPassword, newPassword, confirmNewPassword } = password;

    //console.log(password);

    if (newPassword !== confirmNewPassword) {
      return new Error(
        'Please check your new password fields to make sure they are the same.'
      );
    }

    const body = JSON.stringify({ oldPassword, newPassword });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.put(`${CURRENT_IP}/api/auth/password`, body, config);
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
