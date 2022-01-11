import {
  AUTHENTICATE,
  LOGOUT,
  FORGOT_PASSWORD,
  SET_DID_TRY_AL,
} from '../types';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  veriCode: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: false,
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        veriCode: action.code,
      };
    default:
      return state;
  }
};
