/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NotificationSystem from 'rc-notification';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';
import { BasicNotification } from '../../shared/components/Notification';

import { changeThemeToDark, changeThemeToLight } from '../../redux/actions/themeActions';
import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions';

let notificationRU = null;

const showNotification = (notification) => {
  notificationRU.notice({
    content: <BasicNotification
      color={notification.color} // primary, success, warning, danger, normal
      title={notification.title}
      message={notification.content}
    />,
    duration: notification.duration,
    closable: true,
    style: { top: 0, left: 'calc(100vw - 100%)' },
    className: 'right-up ltr-support',
  });
};

class Layout extends Component {
  componentDidMount() {
    NotificationSystem.newInstance({ style: { top: 65 } }, n => notificationRU = n);
  }

  componentDidUpdate(prevProps) {
    // Show notification
    const { notificationTime: oldNotificationTime } = prevProps;
    const { notificationTime: newNotificationTime, notification } = this.props;
    if (oldNotificationTime < newNotificationTime) {
      showNotification({
        title: notification.title,
        content: notification.content,
        color: notification.color,
        duration: notification.duration,
      });
    }
  }

  componentWillUnmount() {
    if (notificationRU) {
      notificationRU.destroy();
    }
  }

  changeSidebarVisibility = () => {
    const { dispatch } = this.props;
    dispatch(changeSidebarVisibility());
  };

  changeMobileSidebarVisibility = () => {
    const { dispatch } = this.props;
    dispatch(changeMobileSidebarVisibility());
  };

  changeToDark = () => {
    const { dispatch } = this.props;
    dispatch(changeThemeToDark());
  };

  changeToLight = () => {
    const { dispatch } = this.props;
    dispatch(changeThemeToLight());
  };

  render() {
    const { sidebar } = this.props;

    const layoutClass = classNames({
      layout: true,
      'layout--collapse': sidebar.collapse,
    });

    return (
      <div className={layoutClass}>
        <Topbar
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
          changeSidebarVisibility={this.changeSidebarVisibility}
        />
        <Sidebar
          sidebar={sidebar}
          changeToDark={this.changeToDark}
          changeToLight={this.changeToLight}
          changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { notificationTime: notificationTimeAlias, notification: notificationAlias } = state.site;

  return { sidebar: state.sidebar, notificationTime: notificationTimeAlias, notification: notificationAlias };
};

export default withRouter(connect(mapStateToProps)(Layout));
