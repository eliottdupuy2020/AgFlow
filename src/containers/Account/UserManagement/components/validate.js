/* eslint-disable */
const validate = (values) => {
  const errors = {};
  if (!values.new_password) {
    errors.new_password = 'Password must be 6 characters or longer.';
  } else if (!/^.{6,}$/.test(values.new_password)) {
    errors.new_password = 'Password must be 6 characters or longer.';
  }
  if (values.new_password !== values.new_password_confirm) {
    errors.new_password_confirm = 'Password don\'t match.';
  }

  return errors;
};

export default validate;
