import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import queryString from 'query-string';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startWorking, endWorking } from '../../../redux/actions/siteActions';
import ResetPasswordForm from './components/ResetPasswordForm';

const logo = `${process.env.PUBLIC_URL}/images/logo/logo_dark.png`;

class UserManagement extends PureComponent {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state = {
      error: '',
      params: queryString.parse(location.search),
      showType: '',
      headerMsg: '',
      bodyMsg: '',
      passwordChanged: false,
    };
  }

  componentDidMount() {
    const { params } = this.state;

    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    // Handle the user management action.
    switch (params.mode) {
      case 'resetPassword':
        this.handleResetPassword(params);
        break;
      case 'verifyEmail':
        this.handleVerifyEmail(params);
        break;
      default:
        break;
    }
  }

  handleVerifyEmail = (params) => {
    firebase.auth().applyActionCode(params.oobCode).then((response) => {
      window.location.href = '/price_discovery';
    }).catch((error) => {
      this.setState({
        showType: 'verifyEmail',
        headerMsg: 'Try verifying your email again',
        bodyMsg: error.message,
      });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  handleResetPassword = (params) => {
    firebase.auth().verifyPasswordResetCode(params.oobCode).then(() => {
      this.setState({ showType: 'resetPassword' });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    }).catch((error) => {
      this.setState({
        showType: 'resetPassword',
        headerMsg: 'Try resetting your password again',
        bodyMsg: error.message,
      });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  onResetPassword = ({ new_password: newPassword }) => {
    this.setState({ error: '', passwordChanged: false });
    const { params } = this.state;

    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    firebase.auth().confirmPasswordReset(params.oobCode, newPassword).then((response) => {
      this.setState({
        showType: 'resetPassword',
        headerMsg: 'Password changed',
        bodyMsg: 'You can now sign in with your new password.',
        passwordChanged: true,
      });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    }).catch((error) => {
      this.setState({ error: error.message });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  render() {
    const {
      error, params, showType, headerMsg, bodyMsg, passwordChanged,
    } = this.state;

    let resetPasswordBodyHTML = '';
    let resetPasswordFooterLink = '';
    switch (showType) {
      case 'resetPassword':
        if (bodyMsg) {
          resetPasswordBodyHTML = (
            <div>
              <div className="account__head">
                <Link to="/"><img src={logo} alt="avatar" /></Link>
                <h3 className="account__title">{headerMsg}</h3>
              </div>
              <div className="verify-email-body">
                <div>{bodyMsg}</div>
              </div>
            </div>
          );
        } else {
          resetPasswordBodyHTML = (
            <div>
              <div className="account__head">
                <Link to="/"><img src={logo} alt="avatar" /></Link>
              </div>
              <ResetPasswordForm onSubmit={this.onResetPassword} errorMessage={error} />
            </div>
          );
        }

        if (passwordChanged) {
          resetPasswordFooterLink = <Link to="/login">Back to Login</Link>;
        } else {
          resetPasswordFooterLink = <Link to="/forgot_password">Back to Forgot Password</Link>;
        }

        return (
          <div className="account account--not-photo">
            <div className="account__wrapper">
              <div className="account__card">
                {resetPasswordBodyHTML}
                <div className="account__have-account">
                  {resetPasswordFooterLink}
                </div>
              </div>
            </div>
          </div>
        );
      case 'verifyEmail':
        return (
          <div className="account account--not-photo">
            <div className="account__wrapper">
              <div className="account__card">
                <div className="account__head">
                  <Link to="/"><img src={logo} alt="avatar" /></Link>
                  <h3 className="account__title">{headerMsg}</h3>
                </div>
                <div className="verify-email-body">
                  <div>{bodyMsg}</div>
                </div>
                <div className="account__have-account">
                  <Link to="/signup">Back to Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }

    return (
      <div className="account account--not-photo" />
    );
  }
}

export default connect(null, { startWorking, endWorking })(withRouter(UserManagement));
