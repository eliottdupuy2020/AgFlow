import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { startWorking, endWorking } from '../../../redux/actions/siteActions';
import { sendEmailVerification, sendHubspotUser } from '../../../redux/actions/accountActions';
import SignUpForm from './components/SignUpForm';

const logo = `${process.env.PUBLIC_URL}/images/logo/logo_dark.png`;

class SignUp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      phone: '',
    };
  }

  onSubmitFirebase = ({
    email, password, firstName, lastName, company,
  }) => {
    this.setState({ error: '' });
    const { history, sendEmailVerification: actionSendEmailVerification } = this.props;
    const { phone } = this.state;

    // Redux dispatch: show spinner
    const {
      startWorking: actionStartWorking,
      sendHubspotUser: actionSendHubspotUser,
    } = this.props;
    actionStartWorking();

    firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => {
      /**
       * Save user info to Firebase database
       */
      const { user, additionalUserInfo } = res;
      if (additionalUserInfo.isNewUser && additionalUserInfo.providerId === 'password') {
        const db = firebase.firestore();
        const userObj = {
          email: user.email,
          first_name: firstName || '',
          last_name: lastName || '',
          position: '',
          company,
          country: '',
          phone_mobile: phone || '',
          city: '',
          trial: 'false',
          allowed: 'false',
          avatar: '',
        };
        db.collection('users').doc(user.uid).set(userObj)
          .then(() => {
            // console.log('Document successfully written!');
            actionSendHubspotUser(userObj);

            actionSendEmailVerification(email)
              .then(() => {
                history.push('/verify_email');
              })
              .catch((error) => {
                // console.log(error);
              });
          })
          .catch((error) => {
            // console.error("Error writing document: ", error);
          });
      }

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

  setPhone = (ph) => {
    this.state.phone = ph || '';
  };

  render() {
    const { error } = this.state;

    return (
      <div className="account account--not-photo">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <Link to="/"><img src={logo} alt="avatar" /></Link>
              <h3 className="account__title">Try AgFlow for 7 days for free</h3>
            </div>
            <SignUpForm onSubmit={this.onSubmitFirebase} errorMessage={error} setPhone={this.setPhone} />
            <div className="account__have-account">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendEmailVerification: bindActionCreators(sendEmailVerification, dispatch),
    startWorking: bindActionCreators(startWorking, dispatch),
    endWorking: bindActionCreators(endWorking, dispatch),
    sendHubspotUser: bindActionCreators(sendHubspotUser, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(withRouter(SignUp));
