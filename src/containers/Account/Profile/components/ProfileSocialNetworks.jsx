/* eslint-disable react/no-children-prop */
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import Alert from '../../../../shared/components/Alert';

class ProfileSocialNetworks extends PureComponent {
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
          <span className="form__form-group-label">Linkedin</span>
          <div className="form__form-group-field">
            <Field
              name="linkedin"
              component="input"
              type="url"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Twitter</span>
          <div className="form__form-group-field">
            <Field
              name="twitter"
              component="input"
              type="url"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Blog</span>
          <div className="form__form-group-field">
            <Field
              name="blog"
              component="input"
              type="url"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Vkontakte</span>
          <div className="form__form-group-field">
            <Field
              name="vkontakte"
              component="input"
              type="url"
              placeholder=""
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Website</span>
          <div className="form__form-group-field">
            <Field
              name="website"
              component="input"
              type="url"
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
  form: 'profile_social_networks_form', // a unique identifier for this form
  enableReinitialize: true,
})(ProfileSocialNetworks);
