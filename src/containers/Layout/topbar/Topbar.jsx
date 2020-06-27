import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { endColleagueInvitation } from '../../../redux/actions/inviteColleaguesActions';
import { showNotification } from '../../../redux/actions/siteActions';

import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarInvitation from './TopbarInvitation';
import TopbarProfile from './TopbarProfile';

class Topbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inviteData: {},
    };
  }

  sendInvitation = (value) => {
    const emailAddresses = value.email_addresses;
    // console.log('Email addresses:', emailAddresses);

    // Redux dispatch: end invitation
    const { endColleagueInvitation: actionEndColleagueInvitation } = this.props;
    actionEndColleagueInvitation();

    // Redux dispatch: show notification
    const { showNotification: actionShowNotification } = this.props;
    const notificationData = {
      title: 'Invite Colleagues',
      content: 'We just sent your invitation. Thank you.',
      color: 'primary',
      duration: 5,
    };
    actionShowNotification(notificationData);

    // format email input box
    this.setState({ inviteData: { email_addresses: ' ' } });
    setTimeout(() => {
      this.setState({ inviteData: { email_addresses: '' } });
    }, 500);
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;
    const { inviteData } = this.state;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className="topbar__logo" to="/price_discovery" />
          </div>
          <div className="topbar__right">
            <TopbarInvitation
              initialValues={inviteData}
              onSubmit={this.sendInvitation}
            />
            <TopbarProfile />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { endColleagueInvitation, showNotification })(Topbar);
