import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import ProfileMain from './components/ProfileMain';
import ProfileActiveAddons from './components/ProfileActiveAddons';
import ProfileTabs from './components/ProfileTabs';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <div className="profile">
          <Row>
            <Col md={12} lg={12} xl={5}>
              <Row>
                <ProfileMain />
                <ProfileActiveAddons />
              </Row>
            </Col>
            <ProfileTabs />
          </Row>
        </div>
      </Container>
    );
  }
}

export default Profile;
