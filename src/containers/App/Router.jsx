import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';

import Loading from '../../shared/components/Loading';
import LogIn from '../Account/LogIn/index';
import SignUp from '../Account/SignUp/index';
import ForgotPassword from '../Account/ForgotPassword/index';
import VerifyEmail from '../Account/VerifyEmail/index';
import UserManagement from '../Account/UserManagement/index';
import Profile from '../Account/Profile/index';
import Pricing from '../Pricing/index';
import Freight from '../Freight/index';
import Tradeflows from '../Tradeflows/index';
import Tenders from '../Tenders/index';
import Calendar from '../Calendar/index';
import Reports from '../Reports/index';
import PriceDiscovery from '../PriceDiscovery';

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLogged: false, loading: true };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let isLoggedValue = true;
        if (!user.emailVerified) {
          isLoggedValue = false;
        }

        try {
          const { uid } = firebase.auth().currentUser;
          const docRef = firebase.firestore().collection('users').doc(uid);
          const getOptions = {
            source: 'default',
          };
          const doc = await docRef.get(getOptions);
          const userDataValue = doc.data();
          const isTrialAllowed = userDataValue.trial || '';
          const isAccountAllowed = userDataValue.allowed || '';
          if (isTrialAllowed !== 'true' && isAccountAllowed !== 'true') {
            isLoggedValue = false;
          }
        } catch (e) {
          console.log(e);
        }

        this.setState({ isLogged: isLoggedValue, loading: false });
      } else {
        this.setState({ isLogged: false, loading: false });
      }
    });
  }

  render() {
    const { isLogged, loading } = this.state;
    console.log('isLogged:', isLogged, 'loading:', loading);

    if (loading) {
      return (
        <Loading loading={loading} bgcolor="true" />
      );
    }

    return (
      <MainWrapper>
        <main>
          {isLogged ? (
            <div>
              <Layout />
              <div className="container__wrap">
                <Switch>
                  <Route path="/profile" component={Profile} />
                  <Route path="/pricing" component={Pricing} />
                  <Route path="/freight" component={Freight} />
                  <Route path="/price_discovery" component={PriceDiscovery} />
                  <Route path="/tradeflows" component={Tradeflows} />
                  <Route path="/tenders" component={Tenders} />
                  <Route path="/calendar" component={Calendar} />
                  <Route path="/reports" component={Reports} />
                  <Route path="*">
                    <Redirect to="/price_discovery" />
                  </Route>
                </Switch>
              </div>
            </div>
          ) : (
            <Switch>
              <Route exact path="/" component={LogIn} />
              <Route path="/login" component={LogIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgot_password" component={ForgotPassword} />
              <Route path="/verify_email" component={VerifyEmail} />
              <Route path="/usermgmt" component={UserManagement} />
              <Route path="*">
                <Redirect to="/login" />
              </Route>
            </Switch>
          )}
        </main>
      </MainWrapper>
    );
  }
}

export default Router;
