/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react';

export class BasicNotification extends PureComponent {
  render() {
    const { color, title, message } = this.props;

    return (
      <div className={`notification notification--${color}`}>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    );
  }
}

export class ImageNotification extends PureComponent {
  render() {
    const { img, title, message } = this.props;

    return (
      <div className="notification notification--image">
        <div className="notification__image">
          <img src={img} alt="" />
        </div>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    );
  }
}

export class FullWideNotification extends PureComponent {
  render() {
    const { color, message } = this.props;

    return (
      <div className={`notification notification--full-wide notification--${color}`}>
        <p className="notification__message">{message}</p>
      </div>
    );
  }
}
