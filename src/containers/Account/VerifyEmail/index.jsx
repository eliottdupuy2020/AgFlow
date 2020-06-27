import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startWorking, endWorking } from '../../../redux/actions/siteActions';
import Alert from '../../../shared/components/Alert';

const logo = `${process.env.PUBLIC_URL}/images/logo/logo_dark.png`;

class VerifyEmail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { sentEmail: false, error: '' };
  }

  resendVerifyEmail = (e) => {
    e.preventDefault();

    this.setState({ error: '' });

    const actionCodeSettings = {};
    if (firebase.auth().currentUser) {
      // Redux dispatch: show spinner
      const { startWorking: actionStartWorking } = this.props;
      actionStartWorking();

      firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
        .then(() => {
          this.setState({ sentEmail: true });

          // Redux dispatch: hide spinner
          const { endWorking: actionEndWorking } = this.props;
          actionEndWorking();
        })
        .catch((error) => {
          let errorMessage = '';
          if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many requests!';
          } else {
            errorMessage = error.message;
          }
          this.setState({ error: errorMessage });

          // Redux dispatch: hide spinner
          const { endWorking: actionEndWorking } = this.props;
          actionEndWorking();
        });
    }
  };

  render() {
    const { sentEmail, error } = this.state;
    let sentEmailElement;
    if (sentEmail) {
      sentEmailElement = <span className="sent-email"> &#10003;</span>;
    } else {
      sentEmailElement = '';
    }

    return (
      <div className="account account--not-photo">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <Link to="/"><img src={logo} alt="avatar" /></Link>
              <h3 className="account__title">Please verify your email address</h3>
            </div>
            <div className="verify-email-body">
              <Alert color="danger" isShow={!!error}>
                <p>{error}</p>
              </Alert>
              <div>Get started with AgFlow! Complete your sign up through the email we sent to your email address.</div>
              <div className="receive-email">
                Didn&rsquo;t receive an email? <Link onClick={this.resendVerifyEmail} to="/">Click here</Link>
                {sentEmailElement}
              </div>
            </div>
            <div className="account__have-account">
              <Link to="/login">Back to Log In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { startWorking, endWorking })(withRouter(VerifyEmail));
