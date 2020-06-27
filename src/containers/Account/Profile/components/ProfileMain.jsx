import React from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import {
  Card, CardBody, Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { startWorking, endWorking, showNotification } from '../../../../redux/actions/siteActions';
import { changedUserAvatar } from '../../../../redux/actions/accountActions';
import { endChangePassword } from '../../../../redux/actions/changePasswordActions';

import ChangePasswordModal from './ChangePasswordModal';

class ProfileMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordData: {},
    };

    // file input
    this.photoRef = React.createRef();
    this.choosePhoto = this.choosePhoto.bind(this);
    this.changePhoto = this.changePhoto.bind(this);

    const { uid } = firebase.auth().currentUser;
    this.uid = uid;

    this.db = firebase.firestore();
  }

  changePassword = (value) => {
    const { showNotification: actionShowNotification } = this.props;

    // Redux dispatch: end change password
    const { endChangePassword: actionEndChangePassword } = this.props;
    actionEndChangePassword();

    // format password input boxes
    this.setState({ passwordData: { current_password: ' ', new_password: ' ', new_password_confirm: ' ' } });
    setTimeout(() => {
      this.setState({ passwordData: { current_password: '', password: '', new_password_confirm: '' } });
    }, 500);

    // Login with current password first
    const { email } = firebase.auth().currentUser;
    firebase.auth().signInWithEmailAndPassword(email, value.current_password).then((res) => {
      // Update password of Firebase user
      const user = firebase.auth().currentUser;
      user.updatePassword(value.new_password).then(() => {
        // Redux dispatch: show notification
        const notificationData = {
          title: 'Change password',
          content: 'Your password has been changed successfully!',
          color: 'primary',
          duration: 5,
        };
        actionShowNotification(notificationData);
      }).catch((error) => {
        // Redux dispatch: show notification
        const notificationData = {
          title: 'Change password',
          content: error.message,
          color: 'danger',
          duration: 5,
        };
        actionShowNotification(notificationData);
      });
    }).catch((error) => {
      // Redux dispatch: show notification
      const notificationData = {
        title: 'Current password',
        content: error.message,
        color: 'danger',
        duration: 5,
      };
      actionShowNotification(notificationData);
    });
  };

  updateFirebaseUserProfile = (avatarUrl) => {
    const firebaseUser = firebase.auth().currentUser;
    firebaseUser.updateProfile({
      photoURL: avatarUrl,
    }).then(() => {
      // Update successful.
    }).catch((error) => {
      // An error happened.
    });
  };

  updateProfileData = (avatarUrl) => {
    /**
     * Save data to Firebase database
     */
    const updateData = { avatar: avatarUrl };
    this.db.collection('users').doc(this.uid).update(updateData)
      .then(() => {
        // Update Firebase user's profile
        this.updateFirebaseUserProfile(avatarUrl);

        // Redux dispatch: avatar was changed
        const { changedUserAvatar: actionChangedUserAvatar } = this.props;
        if (avatarUrl) {
          actionChangedUserAvatar(avatarUrl, false);
        } else {
          actionChangedUserAvatar(avatarUrl, true);
        }

        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      })
      .catch((error) => {
        // Redux dispatch: hide spinner
        const { endWorking: actionEndWorking } = this.props;
        actionEndWorking();
      });
  };

  removePhoto = (e) => {
    e.preventDefault();

    // eslint-disable-next-line
    if (window.confirm('Are you sure you want to reset your current avatar?')) {
      // Redux dispatch: show spinner
      const { startWorking: actionStartWorking } = this.props;
      actionStartWorking();

      // Update avatar url to Firebase database
      this.updateProfileData('');
    }
  };

  uploadPhoto = (photo) => {
    // Redux dispatch: show spinner
    const { startWorking: actionStartWorking } = this.props;
    actionStartWorking();

    const storageRef = firebase.storage().ref();
    let fileExtension = '';
    switch (photo.type) {
      case 'image/jpeg':
        fileExtension = 'jpg';
        break;
      case 'image/png':
        fileExtension = 'png';
        break;
      case 'image/gif':
        fileExtension = 'gif';
        break;
      case 'image/bmp':
        fileExtension = 'bmp';
        break;
      case 'image/svg+xml':
        fileExtension = 'svg';
        break;
      default:
        fileExtension = 'jpg';
        break;
    }
    const fileName = `${this.uid}.${fileExtension}`;

    const avatarRef = storageRef.child(`avatars/${fileName}`);
    avatarRef.put(photo).then((snapshot) => {
      const { metadata } = snapshot;
      if (snapshot.state === 'success') {
        storageRef.child(metadata.fullPath).getDownloadURL()
          .then((url) => {
            // Update avatar url to Firebase database
            this.updateProfileData(url);
          })
          .catch((error) => {
            // Redux dispatch: hide spinner
            const { endWorking: actionEndWorking } = this.props;
            actionEndWorking();
          });
      }
    });
  };

  choosePhoto = (event) => {
    event.preventDefault();

    this.photoRef.current.click();
  };

  changePhoto = (event) => {
    event.preventDefault();

    this.uploadPhoto(event.target.files[0]);
  };

  render() {
    let { avatar } = this.props;
    const { fullName, isAvatarRemoved } = this.props;
    const {
      position, phoneOffice, phoneMobile, phoneHome,
    } = this.props;
    const { displayName, photoURL, email } = firebase.auth().currentUser;
    const { passwordData } = this.state;

    if (!avatar) {
      if (isAvatarRemoved) {
        avatar = `${process.env.PUBLIC_URL}/images/avatar-default.png`;
      } else {
        avatar = photoURL || `${process.env.PUBLIC_URL}/images/avatar-default.png`;
      }
    }
    let removeButton = <Link to="/" onClick={this.removePhoto}>Remove photo</Link>;
    if (avatar === `${process.env.PUBLIC_URL}/images/avatar-default.png`) {
      removeButton = <span>&nbsp;</span>;
    }

    const phoneNumber = phoneOffice || phoneMobile || phoneHome;

    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody className="profile__card">
            <div className="profile__information">
              <div className="profile__avatar__container">
                <form>
                  <div className="profile__avatar">
                    <Link to="/" onClick={this.choosePhoto}>
                      <img src={avatar} alt="avatar" />
                    </Link>
                    <button className="lnr lnr-pencil avatar_edit_btn" type="button" onClick={this.choosePhoto} />
                  </div>
                  {removeButton}
                  <input
                    type="file"
                    id="avatar_file"
                    className="avatar_file"
                    ref={this.photoRef}
                    accept="image/*"
                    onChange={this.changePhoto}
                  />
                </form>
              </div>
              <div className="profile__data">
                <p className="profile__name">{fullName}</p>
                <p className="profile__work">{position}</p>
                <p className="profile__contact">{email}</p>
                <p className="profile__contact" dir="ltr">{phoneNumber}</p>
                <ChangePasswordModal
                  initialValues={passwordData}
                  onSubmit={this.changePassword}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    fullName,
    avatar,
    position,
    phone_office: phoneOffice,
    phone_mobile: phoneMobile,
    phone_home: phoneHome,
    isAvatarRemoved,
  } = state.account;

  return {
    fullName, avatar, position, phoneOffice, phoneMobile, phoneHome, isAvatarRemoved,
  };
};

export default connect(mapStateToProps, {
  showNotification, changedUserAvatar, startWorking, endWorking, endChangePassword,
})(ProfileMain);
