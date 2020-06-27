import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
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

class LogInForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    };
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  render() {
    const { handleSubmit, errorMessage } = this.props;
    const { showPassword } = this.state;

    return (
      <form className="form" onSubmit={handleSubmit}>
        <Alert color="danger" isShow={!!errorMessage}>
          <p>{errorMessage}</p>
        </Alert>
        <div className="form__form-group">
          <span className="form__form-group-label">Email address:</span>
          <div className="form__form-group-field">
            <Field
              name="email"
              component={renderField}
              type="email"
              placeholder="Email address"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Password:</span>
          <div className="form__form-group-field">
            <Field
              name="password"
              component={renderField}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
            {/* <button */}
            {/*  className={`form__form-group-button${showPassword ? ' active' : ''}`} */}
            {/*  onClick={e => this.showPassword(e)} */}
            {/*  type="button" */}
            {/* ><EyeIcon /> */}
            {/* </button> */}
          </div>
          <div className="account__forgot-password">
            <Link to="/forgot_password">Forgot a password?</Link>
          </div>
        </div>
        <div className="account__btns login__btns">
          <Button className="account__btn" submit="true" color="primary">Sign In</Button>
          <a className="btn btn-outline-primary account__btn" href="/signup">Create Account</a>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'log_in_form', // a unique identifier for this form
  validate,
})(LogInForm);
