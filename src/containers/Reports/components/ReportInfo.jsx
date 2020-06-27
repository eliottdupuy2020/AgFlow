import React from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class ReportInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data: propsData } = this.props;

    let fileIcon = '';
    switch (propsData.fileType) {
      case 'pdf':
        fileIcon = 'icon-file-pdf';
        break;
      case 'excel':
        fileIcon = 'icon-file-excel';
        break;
      case 'word':
        fileIcon = 'icon-file-word';
        break;
      case 'zip':
        fileIcon = 'icon-file-zip';
        break;
      case 'video':
        fileIcon = 'icon-file-video';
        break;
      default:
        fileIcon = 'icon-file-empty';
        break;
    }

    return (
      <Row className="info-container">
        <Col md={7}>
          <div className="col1">
            <div className="col1-1">
              <img className="company-icon" src={propsData.icon} alt="icon" />
            </div>
            <div className="col1-2">
              <div className="col1-2-name">
                <Link className="companyLink" to="/" target="_blank">{propsData.title}</Link>
              </div>
              <div className="col1-2-date">{propsData.time}</div>
            </div>
          </div>
        </Col>
        <Col md={5}>
          <div className="col2">
            <div className="col2-file">
              <span className={`icon ${fileIcon}`} />&nbsp;
              <Link className="downloadLink" to="/" target="_blank">{propsData.downloadTitle}</Link>
            </div>
            <div className="col2-downloads"><span>{propsData.downloadCount}</span> downloads</div>
          </div>
        </Col>
      </Row>
    );
  }
}
