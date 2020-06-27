import {
  START_WORKING,
  END_WORKING,
  SHOW_NOTIFICATION,
} from '../actions/siteActions';

const initialState = {
  loading: false,
  notificationTime: 0,
  notification: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_WORKING:
      return { ...state, loading: true };
    case END_WORKING:
      return { ...state, loading: false };
    case SHOW_NOTIFICATION:
      return { ...state, notificationTime: Date.now(), notification: action.notification };
    default:
      return state;
  }
}
