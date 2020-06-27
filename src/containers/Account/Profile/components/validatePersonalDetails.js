/* eslint-disable */
const validatePersonalDetails = (values) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = 'First name shouldn’t be empty';
  }
  if (!values.last_name) {
    errors.last_name = 'Last name shouldn’t be empty';
  }
  if (!values.position) {
    errors.position = 'Position shouldn’t be empty';
  }
  if (!values.company) {
    errors.company = 'Company name shouldn’t be empty';
  }
  if (!values.city) {
    errors.city = 'City shouldn’t be empty';
  }
  if (!values.country) {
    errors.country = 'Country shouldn’t be empty';
  }

  return errors;
};

export default validatePersonalDetails;
