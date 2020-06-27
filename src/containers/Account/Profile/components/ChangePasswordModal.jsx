import React from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import classNames from 'classnames';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import { Field, reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { startChangePassword } from '../../../../redux/actions/changePasswordActions';
import validateChangePassword from './validateChangePassword';

const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);

class ChangePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      mustOpen: false,
      disableSubmit: false,
    };
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ modal: true, mustOpen: true }));

    setTimeout(() => {
      this.setState(prevState => ({ mustOpen: false }));
    }, 500);

    // Redux dispatch: start invitation
    const { startChangePassword: actionStartChangePassword } = this.props;
    actionStartChangePassword();
  };

  toggle = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ modal: !prevState.modal }));
  };

  changePassword = (e) => {
    // if (this.checkPasswordValidation(e.target.value)) {
    //   this.setState({ disableSubmit: false });
    // } else {
    //   this.setState({ disableSubmit: true });
    // }
  };

  checkPasswordValidation = (password) => {
    let valid = true;

    if (password.length === 0) {
      valid = false;
    }

    return valid;
  };

  render() {
    const {
      handleSubmit, colored, changed,
    } = this.props;
    const { modal, mustOpen, disableSubmit } = this.state;
    const backdrop = false;
    const unmountOnClose = false;

    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': true,
    });

    let modalShowFlag = modal;
    if (mustOpen) {
      modalShowFlag = true;
    } else if (changed) {
      modalShowFlag = false;
    }

    return (
      <div className="modal__container">
        <Button color="primary" className="profile__btn" onClick={this.openModal}>
          <KeyVariantIcon /> Change password
        </Button>
        <Modal
          isOpen={modalShowFlag}
          toggle={this.toggle}
          backdrop={backdrop}
          unmountOnClose={unmountOnClose}
          modalClassName="ltr-support"
          className={`modal-dialog--primary ${modalClass}`}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.toggle} />
            <h4 className="text-modal  modal__title">Change your password</h4>
          </div>
          <div className="modal__body change-password-container">
            <form className="form form--horizontal" onSubmit={handleSubmit}>
              <div className="form__form-group">
                <span className="form__form-group-label">Current Password</span>
                <div className="form__form-group-field">
                  <Field
                    name="current_password"
                    component={renderField}
                    type="password"
                    placeholder=""
                    onChange={this.changePassword}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">New Password</span>
                <div className="form__form-group-field">
                  <Field
                    name="new_password"
                    component={renderField}
                    type="password"
                    placeholder=""
                    onChange={this.changePassword}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Confirm New Password</span>
                <div className="form__form-group-field">
                  <Field
                    name="new_password_confirm"
                    component={renderField}
                    type="password"
                    placeholder=""
                  />
                </div>
              </div>
              <ButtonToolbar className="form__button-toolbar">
                <Button className="modal_cancel" onClick={this.toggle}>Cancel</Button>{' '}
                <Button
                  disabled={disableSubmit}
                  className="modal_ok"
                  color="primary"
                  type="submit"
                >
                  Change password
                </Button>
              </ButtonToolbar>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { changed } = state.changePassword;

  return { changed };
};

const decoratedComponent = connect(mapStateToProps, { startChangePassword })(ChangePasswordModal);

export default reduxForm({
  form: 'change_password_form', // a unique identifier for this form
  enableReinitialize: true,
  validate: validateChangePassword,
})(decoratedComponent);
