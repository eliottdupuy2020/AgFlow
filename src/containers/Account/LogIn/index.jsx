import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import GooglePlusIcon from 'mdi-react/GooglePlusIcon';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startWorking, endWorking } from '../../../redux/actions/siteActions';
import { sendHubspotUser } from '../../../redux/actions/accountActions';

import LogInForm from './components/LogInForm';

const logo = `${process.env.PUBLIC_URL}/images/logo/logo_dark.png`;

class LogIn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  onSubmitFirebase = ({ email, password }) => {
    this.setState({ error: '' });
    const { history } = this.props;

    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    firebase.auth().signInWithEmailAndPassword(email, password).then(async (res) => {
      // Check if email is verified
      if (!res.user.emailVerified) {
        firebase.auth().signOut().then(() => {
          // console.log('sing out');
        }).catch((error) => {
          // console.log('error', error);
        });
        this.setState({ error: 'Please verify your email address.' });

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();

        return;
      }
      const isPassed = await this.isTrialAccount();
      if (!isPassed) return;

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();

      history.push('/price_discovery');
    }).catch((error) => {
      this.setState({ error: error.message });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  onGoogleClick = () => {
    // Redux dispatch: show spinner
    const {
      startWorking: actionStartWorking,
      sendHubspotUser: actionSendHubspotUser,
    } = this.props;
    actionStartWorking();

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(async (result) => {
      /**
       * Save Google user info to Firebase database
       */
      const { user, additionalUserInfo } = result;
      if (additionalUserInfo.isNewUser && additionalUserInfo.providerId === 'google.com') {
        const { profile } = additionalUserInfo;
        const db = firebase.firestore();
        const userObj = {
          email: profile.email,
          first_name: profile.given_name || '',
          last_name: profile.family_name || '',
          position: '',
          company: '',
          country: '',
          phone_mobile: '',
          city: '',
          avatar: profile.picture || '',
          trial: 'false',
          allowed: 'false',
        };
        db.collection('users').doc(user.uid).set(userObj)
          .then(() => {
            // console.log('Document successfully written!');
            actionSendHubspotUser(userObj);
            this.isTrialAccount();
          })
          .catch((error) => {
            // console.error('Error writing document: ', error);
          });
      }

      if (!additionalUserInfo.isNewUser && additionalUserInfo.providerId === 'google.com') {
        const { history } = this.props;
        const isPassed = await this.isTrialAccount();
        if (!isPassed) return;
        history.push('/price_discovery');
      }

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    }).catch((error) => {
      // console.log('errorGoogle', error);

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  isTrialAccount = async () => {
    // Check trial status
    try {
      const { uid } = firebase.auth().currentUser;
      const docRef = firebase.firestore().collection('users').doc(uid);
      const getOptions = {
        source: 'default',
      };
      const doc = await docRef.get(getOptions);
      const userDataValue = doc.data();
      const isTrialAllowed = userDataValue.trial;
      const isAccountAllowed = userDataValue.allowed;
      if (isTrialAllowed !== 'true' && isAccountAllowed !== 'true') {
        firebase.auth().signOut().then(() => {
          // console.log('sing out');
        }).catch((error) => {
          // console.log('error', error);
        });
        this.setState({ error: 'Your trial account is not allowed by the sales team yet.' });

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();

        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return true;
  };

  render() {
    const { error } = this.state;

    return (
      <div className="account account--not-photo">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <Link to="/"><img src={logo} alt="avatar" /></Link>
            </div>
            <LogInForm onSubmit={this.onSubmitFirebase} errorMessage={error} />
            <div className="account__or">
              <p>Or Easily Using</p>
            </div>
            <div className="account__social">
              <Button
                className="account__social-btn account__social-btn--google"
                type="button"
                onClick={this.onGoogleClick}
              >
                <GooglePlusIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    startWorking: bindActionCreators(startWorking, dispatch),
    endWorking: bindActionCreators(endWorking, dispatch),
    sendHubspotUser: bindActionCreators(sendHubspotUser, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(withRouter(LogIn));
