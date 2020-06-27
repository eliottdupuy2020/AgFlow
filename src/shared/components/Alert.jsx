import React, { PureComponent } from 'react';
import { Alert, Button } from 'reactstrap';
import InformationOutlineIcon from 'mdi-react/InformationOutlineIcon';
import ThumbUpOutlineIcon from 'mdi-react/ThumbUpOutlineIcon';
import CommentAlertOutlineIcon from 'mdi-react/CommentAlertOutlineIcon';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';

export default class AlertComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };
  }

  onShow = () => {
    this.setState({ visible: true });
  };

  onDismiss = () => {
    this.setState({ visible: false });
  };

  render() {
    const { isShow } = this.props;
    const { visible } = this.state;

    const {
      color, className, icon, children,
    } = this.props;
    let Icon;

    switch (color) {
      case 'info':
        Icon = <InformationOutlineIcon />;
        break;
      case 'success':
        Icon = <ThumbUpOutlineIcon />;
        break;
      case 'warning':
        Icon = <CommentAlertOutlineIcon />;
        break;
      case 'danger':
        Icon = <CloseCircleOutlineIcon />;
        break;
      default:
        break;
    }

    if (isShow && visible) {
      return (
        <Alert color={color} className={className} isOpen={visible}>
          {icon && <div className="alert__icon">{Icon}</div>}
          <button className="close" type="button" onClick={this.onDismiss}><span className="lnr lnr-cross" /></button>
          <div className="alert__content">
            {children}
          </div>
        </Alert>
      );
    }

    return <Button style={{ display: 'none' }} onClick={this.onShow}>Show Alert</Button>;
  }
}
