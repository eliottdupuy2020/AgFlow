import React, { PureComponent } from 'react';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'reactstrap';

import { withStyles } from '@material-ui/core/styles';
import Alert from '../../../../shared/components/Alert';
import validate from './validate';

import renderSelectField from '../../../../shared/components/form/Select';
import countries from '../../../../shared/countries';

const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);

const parsePhoneNumber = string => string.replace(/[ ()-]/g, '');

const styles = () => ({
  phone: {
    backgroundColor: '#192038',
    flex: 1,
  },
});

class SignUpForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    };

    this.showPassword = this.showPassword.bind(this);
  }

  onChangePhone = (phone) => {
    const { setPhone } = this.props;
    setPhone(parsePhoneNumber(phone));
  };

  showPassword(e) {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  render() {
    const { handleSubmit, errorMessage, classes } = this.props;
    const { showPassword } = this.state;

    return (
      <form className="form" onSubmit={handleSubmit}>
        <Alert color="danger" isShow={!!errorMessage}>
          <p>{errorMessage}</p>
        </Alert>
        <div className="form__form-group">
          <div className="form__form-group-field-group">
            <div className="form__form-group-field-item left">
              <Field
                name="firstName"
                component={renderField}
                type="text"
                placeholder="First name"
              />
            </div>
            <div className="form__form-group-field-item">
              <Field
                name="lastName"
                component={renderField}
                type="text"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
        <div className="form__form-group">
          <div className="form__form-group-field">
            <Field
              name="email"
              component={renderField}
              type="email"
              placeholder="Email address *"
            />
          </div>
        </div>
        <div className="form__form-group">
          <div className="form__form-group-field">
            <Field
              name="password"
              component={renderField}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password *"
            />
          </div>
        </div>
        <div className="form__form-group">
          <div className="form__form-group-field-group">
            <div className="form__form-group-field-item">
              <Field
                name="company"
                component={renderField}
                type="text"
                placeholder="Company"
              />
            </div>
          </div>
        </div>
        <div className="form__form-group form__form-group--forgot">
          <div className="form__form-group-field">
            {/*
            <Field
              name="phone"
              component={renderField}
              type="number"
              placeholder="Phone number"
            />
            */}
            <MuiPhoneNumber
              name="phone"
              defaultCountry="us"
              disableAreaCodes
              className={classes.phone}
              onChange={this.onChangePhone}
            />
          </div>
        </div>
        <div className="account__btns register__btns">
          <Button type="submit" color="primary" className="account__btn">
            Free trial
          </Button>
          <p>By signing up, I agree to the AgFlow Privacy Policy & Terms of Service.</p>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'signup_form', // a unique identifier for this form
  validate,
})(withStyles(styles)(SignUpForm));
