import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loading from '../../shared/components/Loading';

class MainWrapper extends PureComponent {
  render() {
    const {
      theme, children, rtl, location, site,
    } = this.props;

    const direction = location.pathname === '/' ? 'ltr' : rtl.direction;

    return (
      <div className={`${theme.className} ${direction}-support`} dir={direction}>
        <div className="wrapper">
          {site.loading && (
            <Loading loading={site.loading} />
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  theme: state.theme,
  rtl: state.rtl,
  site: state.site,
}))(MainWrapper));
