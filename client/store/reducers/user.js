import { GET_USER, UPDATE_PROFILE } from '../types';

const initialState = {
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.user,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.user,
      };
  }
  return state;
};
