import {
  START_CHANGE_PASSWORD,
  END_CHANGE_PASSWORD,
} from '../actions/changePasswordActions';

const initialState = {
  changed: false, // flag for modal show and hide
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_CHANGE_PASSWORD:
      return { changed: false };
    case END_CHANGE_PASSWORD:
      return { changed: true };
    default:
      return state;
  }
}
