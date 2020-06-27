import React, { PureComponent } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {
  Card, Col, Nav, NavItem, NavLink, TabContent, TabPane,
} from 'reactstrap';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { startWorking, endWorking } from '../../../../redux/actions/siteActions';
import { changedUserData } from '../../../../redux/actions/accountActions';

import ProfilePersonalDetails from './ProfilePersonalDetails';
import ProfileContactDetails from './ProfileContactDetails';
import ProfileSocialNetworks from './ProfileSocialNetworks';

class ProfileTabs extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      userData: {},
    };

    const { uid } = firebase.auth().currentUser;
    this.uid = uid;

    this.db = firebase.firestore();
  }

  componentDidMount() {
    this.getUserDataFromFirebase();
  }

  getUserDataFromFirebase = () => {
    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    const docRef = this.db.collection('users').doc(this.uid);
    const getOptions = {
      source: 'default',
    };
    docRef.get(getOptions).then((doc) => {
      const userDataValue = doc.data();
      this.setState({ userData: userDataValue });

      // Redux dispatch: user data was changed
      let fullNameStr = '';
      if (userDataValue.first_name && userDataValue.last_name) {
        fullNameStr = `${userDataValue.first_name} ${userDataValue.last_name}`;
      }
      const { changedUserData: actionChangedUserData } = this.props;
      actionChangedUserData({ fullName: fullNameStr, ...userDataValue });

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    }).catch((error) => {
      // console.log('Error getting document:', error);

      // Redux dispatch: hide spinner
      const { endWorking: actionEndWorking } = this.props;
      actionEndWorking();
    });
  };

  savePersonalDetails = (values) => {
    const saveData = {
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      position: values.position || '',
      company: values.company || '',
      city: values.city || '',
      country: values.country || '',
      short_biography: values.short_biography || '',
    };
    this.saveProfileData(saveData, 'personal');
  };

  saveContactDetails = (values) => {
    const saveData = {
      contact_email: values.contact_email || '',
      phone_office: values.phone_office || '',
      phone_mobile: values.phone_mobile || '',
      phone_home: values.phone_home || '',
      skype: values.skype || '',
      im: values.im || '',
    };
    this.saveProfileData(saveData, 'contact');
  };

  saveSocialNetworks = (values) => {
    const saveData = {
      linkedin: values.linkedin || '',
      twitter: values.twitter || '',
      blog: values.blog || '',
      vkontakte: values.vkontakte || '',
      website: values.website || '',
    };
    this.saveProfileData(saveData, 'social');
  };

  updateFirebaseUserProfile = (saveData) => {
    const firebaseUser = firebase.auth().currentUser;
    const fullName = `${saveData.first_name} ${saveData.last_name}`;
    firebaseUser.updateProfile({
      displayName: fullName,
    }).then(() => {
      // Update successful.
    }).catch((error) => {
      // An error happened.
    });
  };

  saveProfileData = (saveData, formType) => {
    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    // Init message
    this.setState({
      successPersonal: '',
      successContact: '',
      successSocial: '',
      errorPersonal: '',
      errorContact: '',
      errorSocial: '',
    });

    /**
     * Save data to Firebase database
     */
    this.db.collection('users').doc(this.uid).update(saveData)
      .then(() => {
        switch (formType) {
          case 'personal':
            this.setState({ successPersonal: 'Saved successfully!' });

            // Update Firebase user's profile
            this.updateFirebaseUserProfile(saveData);

            break;
          case 'contact':
            this.setState({ successContact: 'Saved successfully!' });
            break;
          case 'social':
            this.setState({ successSocial: 'Saved successfully!' });
            break;
          default:
            break;
        }

        // Redux dispatch: user data was changed
        let fullNameStr = '';
        if (saveData.first_name && saveData.last_name) {
          fullNameStr = `${saveData.first_name} ${saveData.last_name}`;
        }
        const { changedUserData: actionChangedUserData } = this.props;
        actionChangedUserData({ fullName: fullNameStr, ...saveData });

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      })
      .catch((error) => {
        // console.error("Error writing document: ", error);
        switch (formType) {
          case 'personal':
            this.setState({ errorPersonal: error.message });
            break;
          case 'contact':
            this.setState({ errorContact: error.message });
            break;
          case 'social':
            this.setState({ errorSocial: error.message });
            break;
          default:
            break;
        }

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      });
  };

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const {
      userData, errorPersonal, successPersonal, errorContact, successContact, errorSocial, successSocial,
    } = this.state;
    const { activeTab } = this.state;

    return (
      <Col md={12} lg={12} xl={7}>
        <Card>
          <div className="profile__card tabs tabs--bordered-bottom">
            <div className="tabs__wrap">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '1' })}
                    onClick={() => {
                      this.toggle('1');
                    }}
                  >
                    Personal details
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '2' })}
                    onClick={() => {
                      this.toggle('2');
                    }}
                  >
                    Contact details
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: activeTab === '3' })}
                    onClick={() => {
                      this.toggle('3');
                    }}
                  >
                    Social networks
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <ProfilePersonalDetails
                    onSubmit={this.savePersonalDetails}
                    initialValues={userData}
                    errorMessage={errorPersonal}
                    successMessage={successPersonal}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <ProfileContactDetails
                    onSubmit={this.saveContactDetails}
                    initialValues={userData}
                    errorMessage={errorContact}
                    successMessage={successContact}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <ProfileSocialNetworks
                    onSubmit={this.saveSocialNetworks}
                    initialValues={userData}
                    errorMessage={errorSocial}
                    successMessage={successSocial}
                  />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}

export default connect(null, { changedUserData, startWorking, endWorking })(ProfileTabs);
