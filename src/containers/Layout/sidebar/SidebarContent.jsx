import React, { Component } from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';

import SidebarLink from './SidebarLink';
import SidebarLinkIcoMoon from './SidebarLinkIcoMoon';

class SidebarContent extends Component {
  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  signOut = (event) => {
    event.preventDefault();

    firebase.auth().signOut().then(() => {
      // console.log('Sign out');
    }).catch((error) => {
      // console.log('Sign out error', error);
    });
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLinkIcoMoon
            title="Price Discovery"
            icon="search"
            route="/price_discovery"
            onClick={this.hideSidebar}
          />
          <SidebarLinkIcoMoon title="Freight" icon="truck" route="/freight" onClick={this.hideSidebar} />
          <SidebarLinkIcoMoon title="Tradeflows" icon="coin-dollar" route="/tradeflows" onClick={this.hideSidebar} />
          <SidebarLinkIcoMoon title="Tenders" icon="file-text" route="/tenders" onClick={this.hideSidebar} />
          <SidebarLinkIcoMoon title="Calendar" icon="calendar" route="/calendar" onClick={this.hideSidebar} />
          {/* <SidebarLink title="Reports" icon="chart-bars" route="/reports" onClick={this.hideSidebar} /> */}
        </ul>
        <ul className="sidebar__block">
          <SidebarLink title="Logout" icon="exit" route="/logout" onClick={this.signOut} />
          <SidebarLink
            title="AgFlow v2.0 Beta1"
            icon=""
            route="/beta"
            onClick={this.hideSidebar}
            style={{ fontSize: '9px' }}
          />
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
