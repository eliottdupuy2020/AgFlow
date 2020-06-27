/* eslint-disable react/no-children-prop */
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderSelectField from '../../../../shared/components/form/Select';
import Alert from '../../../../shared/components/Alert';
import validatePersonalDetails from './validatePersonalDetails';
import countries from '../../../../shared/countries';

const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);

class ProfilePersonalDetails extends PureComponent {
  render() {
    const {
      handleSubmit, reset, successMessage, errorMessage,
    } = this.props;

    return (
      <form className="form" onSubmit={handleSubmit}>
        <Alert color="danger" isShow={!!errorMessage}>
          <p>{errorMessage}</p>
        </Alert>
        <Alert color="info" isShow={!!successMessage}>
          <p>{successMessage}</p>
        </Alert>

        <div className="form__form-group">
          <span className="form__form-group-label">First name *</span>
          <div className="form__form-group-field">
            <Field
              name="first_name"
              component={renderField}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Last name *</span>
          <div className="form__form-group-field">
            <Field
              name="last_name"
              component={renderField}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Position *</span>
          <div className="form__form-group-field">
            <Field
              name="position"
              component={renderField}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Company name *</span>
          <div className="form__form-group-field">
            <Field
              name="company"
              component={renderField}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Country *</span>
          <div className="form__form-group-field">
            <Field
              name="country"
              component={renderSelectField}
              options={countries}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">City *</span>
          <div className="form__form-group-field">
            <Field
              name="city"
              component={renderField}
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Short biography</span>
          <div className="form__form-group-field">
            <Field
              name="short_biography"
              component="textarea"
              type="text"
              placeholder="Type your bio/company profile here"
            />
          </div>
        </div>

        <ButtonToolbar className="form__button-toolbar">
          <Button color="primary" type="submit">Save</Button>
          <Button type="button" onClick={reset}>
            Cancel
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

export default reduxForm({
  form: 'profile_personal_details_form', // a unique identifier for this form
  enableReinitialize: true,
  validate: validatePersonalDetails,
})(ProfilePersonalDetails);
