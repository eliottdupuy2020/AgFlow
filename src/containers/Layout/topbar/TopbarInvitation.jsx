/* eslint-disable react/no-array-index-key */
import React from 'react';
import AccountMultiplePlusIcon from 'mdi-react/AccountMultiplePlusIcon';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startColleagueInvitation, inviteTeamMember } from '../../../redux/actions/inviteColleaguesActions';

class TopbarInvitation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      mustOpen: false,
      disableSend: true,
      matesEmail: [],
    };
  }

  openModal = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ modal: true, mustOpen: true }));

    setTimeout(() => {
      this.setState(prevState => ({ mustOpen: false }));
    }, 500);

    // Redux dispatch: start invitation
    const { startColleagueInvitation: actionStartColleagueInvitation } = this.props;
    actionStartColleagueInvitation();
  };

  toggle = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ modal: !prevState.modal }));
  };

  changeEmailAddresses = (e) => {
    if (this.checkEmailsValidation(e.target.value)) {
      this.setState({ disableSend: false });
    } else {
      this.setState({ disableSend: true });
    }
  };

  checkEmailsValidation = (emails) => {
    const memberEmail = emails.split(',') || [];
    this.state.matesEmail = memberEmail.map(element => (element || '').trim());

    let valid = true;
    for (let n = 0; n < memberEmail.length; n += 1) {
      const memberInfo = memberEmail[n].trim();
      // eslint-disable-next-line
      const validRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!memberInfo.match(validRegExp)) {
        valid = false;
        break;
      }
    }

    return valid;
  };

  handleSubmitForm = () => {
    const { matesEmail } = this.state;
    const { fullName, inviteTeamMember: actionInviteTeamMember } = this.props;

    for (let i = 0; i < matesEmail.length; i += 1) {
      actionInviteTeamMember(matesEmail[i], fullName);
    }
  };

  render() {
    const {
      handleSubmit, colored, invited,
    } = this.props;
    const { modal, mustOpen, disableSend } = this.state;

    const modalClass = classNames({
      'modal-dialog--colored': colored,
      'modal-dialog--header': true,
    });

    let modalShowFlag = modal;
    if (mustOpen) {
      modalShowFlag = true;
    } else if (invited) {
      modalShowFlag = false;
    }

    return (
      <div>
        <button className="topbar__btn" type="button" onClick={this.openModal}>
          <AccountMultiplePlusIcon /> <span className="button__text">Invite Colleagues</span>
        </button>

        <Modal
          isOpen={modalShowFlag}
          toggle={this.toggle}
          modalClassName="ltr-support"
          className={`modal-dialog--primary ${modalClass}`}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.toggle} />
            <h4 className="text-modal  modal__title">Invite Colleagues</h4>
          </div>
          <div className="modal__body">
            <div className="invite-colleagues-container">
              <form className="form" onSubmit={handleSubmit}>
                <div><h4 className="bold-text">DO NOT LEAVE YOUR COLLEAGUES BEHIND</h4></div>
                <p className="typography--message">
                  Invite your team to AgFlow and enjoy the full benefits of sharing the same data source.
                </p>
                <Field
                  name="email_addresses"
                  component="textarea"
                  type="text"
                  placeholder="Enter professional email addresses separated with comma"
                  onChange={this.changeEmailAddresses}
                />
                <ButtonToolbar className="form__button-toolbar">
                  <Button className="modal_cancel" onClick={this.toggle}>Later</Button>{' '}
                  <Button
                    disabled={disableSend}
                    onClick={this.handleSubmitForm}
                    className="modal_ok"
                    color="primary"
                    type="submit"
                  >
                    Invite
                  </Button>
                </ButtonToolbar>
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { invited } = state.inviteColleagues;
  const { fullName } = state.account;

  return { invited, fullName };
};

function mapDispatchToProps(dispatch) {
  return {
    startColleagueInvitation: bindActionCreators(startColleagueInvitation, dispatch),
    inviteTeamMember: bindActionCreators(inviteTeamMember, dispatch),
  };
}

const decoratedComponent = connect(mapStateToProps, mapDispatchToProps)(TopbarInvitation);

export default reduxForm({
  form: 'invite_colleagues_form', // a unique identifier for this form
  enableReinitialize: true,
})(decoratedComponent);
