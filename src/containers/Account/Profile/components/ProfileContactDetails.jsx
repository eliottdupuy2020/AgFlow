/* eslint-disable react/no-children-prop */
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import Alert from '../../../../shared/components/Alert';

class ProfileContactDetails extends PureComponent {
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
          <span className="form__form-group-label">Email</span>
          <div className="form__form-group-field">
            <Field
              name="contact_email"
              component="input"
              type="email"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Office</span>
          <div className="form__form-group-field">
            <Field
              name="phone_office"
              component="input"
              type="tel"
              placeholder=""
              pattern="^$|^([+][0-9]{1,3}([ .-])?)?([(][0-9]{1,6}[)])?([0-9 .-]{1,32})([0-9]{1,4}?)[ ]*$"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Mobile</span>
          <div className="form__form-group-field">
            <Field
              name="phone_mobile"
              component="input"
              type="tel"
              placeholder=""
              pattern="^$|^([+][0-9]{1,3}([ .-])?)?([(][0-9]{1,6}[)])?([0-9 .-]{1,32})([0-9]{1,4}?)[ ]*$"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Home</span>
          <div className="form__form-group-field">
            <Field
              name="phone_home"
              component="input"
              type="tel"
              placeholder=""
              pattern="^$|^([+][0-9]{1,3}([ .-])?)?([(][0-9]{1,6}[)])?([0-9 .-]{1,32})([0-9]{1,4}?)[ ]*$"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Skype</span>
          <div className="form__form-group-field">
            <Field
              name="skype"
              component="input"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">IM</span>
          <div className="form__form-group-field">
            <Field
              name="im"
              component="input"
              type="text"
              placeholder=""
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
  form: 'profile_contact_details_form', // a unique identifier for this form
  enableReinitialize: true,
})(ProfileContactDetails);
