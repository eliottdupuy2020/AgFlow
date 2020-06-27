import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
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

class ForgotPasswordForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goHome = () => {
    const { goHome } = this.props;
    goHome();
  };

  render() {
    const { handleSubmit, errorMessage, isSentEmail } = this.props;

    if (isSentEmail) {
      return (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__form-group">
            <p className="">
              An email has been sent to you. Follow the link to change your password.
            </p>
          </div>
        </form>
      );
    }

    return (
      <form className="form" onSubmit={handleSubmit}>
        <Alert color="danger" isShow={!!errorMessage}>
          <p>{errorMessage}</p>
        </Alert>
        <div className="form__form-group">
          <p className="">
            Enter your email address to receive an invitation to reset your password.
            Please make sure you provide the email address linked to your AgFlow account.
          </p>
          <div className="form__form-group-field forgot_form-group-field">
            <Field
              name="email"
              component={renderField}
              type="email"
              placeholder="Email address"
            />
          </div>
        </div>
        <div className="account__btns forgot__btns">
          <Button className="account__btn" submit="true" color="primary">Reset your password</Button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'forgot_password_form', // a unique identifier for this form
  validate,
})(ForgotPasswordForm);
