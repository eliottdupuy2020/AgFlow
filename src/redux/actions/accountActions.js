import { sendVerification, saveHubspotUser, updateHubspotUser } from '../../lib/rest';

export const ACCOUNT_INFO_CHANGED = 'ACCOUNT_INFO_CHANGED';
export const ACCOUNT_AVATAR_CHANGED = 'ACCOUNT_AVATAR_CHANGED';
export const ACCOUNT_EMAIL_VERIFY = 'ACCOUNT_EMAIL_VERIFY';
export const ACCOUNT_HUBSPOT_SIGNUP = 'ACCOUNT_HUBSPOT_SIGNUP';
export const ACCOUNT_HUBSPOT_PROFILE = 'ACCOUNT_HUBSPOT_PROFILE';

export function changedUserData(userData) {
  return {
    type: ACCOUNT_INFO_CHANGED,
    user: userData,
  };
}

export function changedUserAvatar(avatarUrl, isAvatarRemoved = false) {
  return {
    type: ACCOUNT_AVATAR_CHANGED,
    avatar: { url: avatarUrl, isRemoved: isAvatarRemoved },
  };
}

export const sendEmailVerification = email => dispatch => sendVerification(email)
  .then((data) => {
    dispatch({
      type: ACCOUNT_EMAIL_VERIFY,
      isSent: true,
    });
  })
  .catch((err) => {
    dispatch({
      type: ACCOUNT_EMAIL_VERIFY,
      isSent: false,
    });
  });

export const sendHubspotUser = userObj => dispatch => saveHubspotUser(userObj)
  .then((data) => {
    dispatch({
      type: ACCOUNT_HUBSPOT_SIGNUP,
      isSent: true,
    });
  })
  .catch((err) => {
    dispatch({
      type: ACCOUNT_HUBSPOT_SIGNUP,
      isSent: false,
    });
  });

export const updateUserProfile = userObj => dispatch => updateHubspotUser(userObj)
  .then((data) => {
    dispatch({
      type: ACCOUNT_HUBSPOT_PROFILE,
      isSent: true,
    });
  })
  .catch((err) => {
    dispatch({
      type: ACCOUNT_HUBSPOT_PROFILE,
      isSent: false,
    });
  });
