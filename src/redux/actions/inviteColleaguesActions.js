import { sendTeamInvite } from '../../lib/rest';

export const START_COLLEAGUE_INVITATION = 'START_COLLEAGUE_INVITATION';
export const END_COLLEAGUE_INVITATION = 'END_COLLEAGUE_INVITATION';
export const COLLEAGUE_INVITE_MEMBER = 'ACCOUNT_INVITE_MEMBER';

export function startColleagueInvitation() {
  return {
    type: START_COLLEAGUE_INVITATION,
  };
}

export function endColleagueInvitation() {
  return {
    type: END_COLLEAGUE_INVITATION,
  };
}

export const inviteTeamMember = (email, firstName) => dispatch => sendTeamInvite(email, firstName)
  .then((data) => {
    dispatch({
      type: COLLEAGUE_INVITE_MEMBER,
      isSent: true,
    });
  })
  .catch((err) => {
    dispatch({
      type: COLLEAGUE_INVITE_MEMBER,
      isSent: false,
    });
  });
