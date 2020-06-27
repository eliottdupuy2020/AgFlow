/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import {
  Card, CardBody, Col, Badge, Table,
} from 'reactstrap';

const ProfileActiveAddons = () => (
  <Col md={12} lg={12} xl={12}>
    <Card>
      <CardBody className="profile__card">
        <p className="profile__active-addons-title">Your Active addons</p>
        <div className="profile__active-addons">
          <Table className="table--bordered" responsive>
            <thead>
              <tr>
                <th>Products</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price Discovery All</td>
                <td>2019-11-05</td>
                <td>2020-01-01</td>
                <td><Badge color="success">Active</Badge></td>
              </tr>
              <tr>
                <td>Tradeflows All</td>
                <td>2019-11-05</td>
                <td>2020-01-01</td>
                <td><Badge color="warning">Disabled</Badge></td>
              </tr>
            </tbody>
          </Table>

        </div>
      </CardBody>
    </Card>
  </Col>
);

export default ProfileActiveAddons;
