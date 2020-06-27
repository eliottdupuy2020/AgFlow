import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startWorking, endWorking } from '../../../redux/actions/siteActions';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const logo = `${process.env.PUBLIC_URL}/images/logo/logo_dark.png`;

class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { sentEmail: false, error: '' };
  }

  onSubmitFirebase = ({ email }) => {
    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ sentEmail: true });

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      })
      .catch((error) => {
        // console.log('error', error);
        let { message } = error;
        if (error.code === 'auth/user-not-found') {
          message = 'Not registered to AgFlow';
        }
        this.setState({ error: message });

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      });
  };

  goHome = () => {
    const { history } = this.props;

    history.push('/');
  };

  render() {
    const { sentEmail, error } = this.state;
    return (
      <div className="account account--not-photo">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <Link to="/"><img src={logo} alt="avatar" /></Link>
              <h3 className="account__title">Forgot your password?</h3>
            </div>
            <ForgotPasswordForm
              onSubmit={this.onSubmitFirebase}
              errorMessage={error}
              isSentEmail={sentEmail}
              goHome={this.goHome}
            />
            <div className="account__have-account">
              <Link to="/login">Back to Log In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { startWorking, endWorking })(withRouter(ForgotPassword));
