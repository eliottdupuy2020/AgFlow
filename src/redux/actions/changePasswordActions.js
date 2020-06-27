export const START_CHANGE_PASSWORD = 'START_CHANGE_PASSWORD';
export const END_CHANGE_PASSWORD = 'END_CHANGE_PASSWORD';

export function startChangePassword() {
  return {
    type: START_CHANGE_PASSWORD,
  };
}

export function endChangePassword() {
  return {
    type: END_CHANGE_PASSWORD,
  };
}
