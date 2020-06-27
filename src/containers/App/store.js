import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import reduxThunk from 'redux-thunk';

import {
  sidebarReducer,
  themeReducer,
  rtlReducer,
  siteReducer,
  accountReducer,
  tendersReducer,
  inviteColleaguesReducer,
  changePasswordReducer,
} from '../../redux/reducers/index';

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  rtl: rtlReducer,
  site: siteReducer,
  account: accountReducer,
  tenders: tendersReducer,
  inviteColleagues: inviteColleaguesReducer,
  changePassword: changePasswordReducer,
});

// const store = createStore(reducer, );

const store = createStore(reducer,
  compose(
    applyMiddleware(reduxThunk),
    // eslint-disable-next-line
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ));

export default store;
