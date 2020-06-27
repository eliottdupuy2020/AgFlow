import React, { Component, Fragment } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import { LicenseManager } from 'ag-grid-enterprise';
import Router from './Router';
import store from './store';
import ScrollToTop from './ScrollToTop';
import firebaseConfig from '../../config/firebase';
import Loading from '../../shared/components/Loading';

LicenseManager.setLicenseKey('[TRIAL]_17_April_2020_[v2]_MTU4NzA4MTYwMDAwMA==0b3758ea7920a80d972f7bd1718e805f');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loaded: false,
    };
    firebase.initializeApp(firebaseConfig);
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({ loading: false });
      setTimeout(() => this.setState({ loaded: true }), 500);
    });
  }

  render() {
    const { loaded, loading } = this.state;
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop>
            <Fragment>
              {!loaded
                && (
                  <Loading loading={loading} />
                )
              }
              <div>
                <Router />
              </div>
            </Fragment>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
