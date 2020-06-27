import React, { PureComponent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import { connect } from 'react-redux';

import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';

class TopbarProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  signOut = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
    firebase.auth().signOut().then(() => {
      // console.log('Sign out');
    }).catch((error) => {
      // console.log('Sign out error', error);
    });
  };

  render() {
    const { collapse } = this.state;
    let { fullName, avatar } = this.props;
    const { isAvatarRemoved } = this.props;
    const { displayName, photoURL, email } = firebase.auth().currentUser;

    if (!fullName) {
      fullName = displayName || email;
    }
    if (!avatar) {
      if (isAvatarRemoved) {
        avatar = `${process.env.PUBLIC_URL}/images/avatar-default.png`;
      } else {
        avatar = photoURL || `${process.env.PUBLIC_URL}/images/avatar-default.png`;
      }
    }

    return (
      <div className="topbar__profile">
        <button type="button" className="topbar__avatar" onClick={this.toggle}>
          <img className="topbar__avatar-img" src={avatar} alt="avatar" />
          <p className="topbar__avatar-name">{ fullName }</p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button type="button" className="topbar__back" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu">
            <TopbarMenuLink title="My Profile" icon="user" path="/profile" onClick={this.toggle} />
            <div className="topbar__menu-divider" />
            <TopbarMenuLink title="Log Out" icon="exit" path="/logout" onClick={this.signOut} />
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { fullName, avatar, isAvatarRemoved } = state.account;

  return { fullName, avatar, isAvatarRemoved };
};

export default connect(mapStateToProps)(TopbarProfile);
