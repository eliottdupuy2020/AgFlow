/* eslint-disable */
const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email field shouldn’t be empty';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password field shouldn’t be empty';
  }
  // if (!values.firstName) {
  //   errors.password = 'First name field shouldn’t be empty';
  // }

  return errors;
};

export default validate;
