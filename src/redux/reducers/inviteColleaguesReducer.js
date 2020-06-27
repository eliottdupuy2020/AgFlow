import {
  START_COLLEAGUE_INVITATION,
  END_COLLEAGUE_INVITATION,
  COLLEAGUE_INVITE_MEMBER,
} from '../actions/inviteColleaguesActions';

const initialState = {
  invited: false, // flag for modal show and hide
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_COLLEAGUE_INVITATION:
      return { invited: false };
    case END_COLLEAGUE_INVITATION:
      return { invited: true };
    case COLLEAGUE_INVITE_MEMBER:
      return { ...state, ...action.isSent };
    default:
      return state;
  }
}
