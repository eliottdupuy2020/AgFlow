import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Alert from '../../../../shared/components/Alert';
import validate from './validate';

const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);

class ResetPasswordForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handleSubmit, errorMessage } = this.props;

    return (
      <form className="form" onSubmit={handleSubmit}>
        <Alert color="danger" isShow={!!errorMessage}>
          <p>{errorMessage}</p>
        </Alert>
        <div className="form__form-group">
          <span className="form__form-group-label">New Password:</span>
          <div className="form__form-group-field">
            <Field
              name="new_password"
              component={renderField}
              type="password"
              placeholder="New Password"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Confirm Password:</span>
          <div className="form__form-group-field">
            <Field
              name="new_password_confirm"
              component={renderField}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div className="account__btns login__btns">
          <Button className="account__btn" submit="true" color="primary">Change password</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'reset_password_form', // a unique identifier for this form
  validate,
})(ResetPasswordForm);
