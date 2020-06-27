import { updateHubspotUser } from '../../lib/rest';
import {
  ACCOUNT_INFO_CHANGED,
  ACCOUNT_AVATAR_CHANGED,
  ACCOUNT_EMAIL_VERIFY,
  ACCOUNT_HUBSPOT_PROFILE,
} from '../actions/accountActions';

const initialState = {
  fullName: '',
  email: '',
  first_name: '',
  last_name: '',
  position: '',
  company: '',
  country: '',
  contact_email: '',
  phone_mobile: '',
  city: '',
  avatar: '',
  short_biography: '',
  phone_office: '',
  phone_home: '',
  skype: '',
  im: '',
  linkedin: '',
  twitter: '',
  blog: '',
  vkontakte: '',
  website: '',
  isSent: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_INFO_CHANGED:
      updateHubspotUser({ ...state, ...action.user });
      return { ...state, ...action.user };
    case ACCOUNT_AVATAR_CHANGED:
      return { ...state, avatar: action.avatar.url, isAvatarRemoved: action.avatar.isRemoved };
    case ACCOUNT_EMAIL_VERIFY:
      return { ...state, ...action.isSent };
    case ACCOUNT_HUBSPOT_PROFILE:
      return { ...state, ...action.isSent };
    default:
      return state;
  }
}
