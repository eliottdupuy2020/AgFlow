import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import CardTradeFlows from './components/CardTradeFlows';
import CardPriceDiscovery from './components/CardPriceDiscovery';
import CardUnlimited from './components/CardUnlimited';
import CardEnterprise from './components/CardEnterprise';

const Pricing = () => (
  <Container>
    <Row>
      <Col md={12}>
        <h3 className="page-title">Unlimited data, unlimited intelligence</h3>
        <h3 className="page-subhead subhead">Choose a plan that is right for your business</h3>
      </Col>
    </Row>
    <Row dir="ltr">
      <CardTradeFlows />
      <CardPriceDiscovery />
      <CardUnlimited />
      <CardEnterprise />
    </Row>
  </Container>
);

export default Pricing;
