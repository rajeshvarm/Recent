/* Import library dependencies */
import React, { Component, PropTypes } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import DocumentTitle from 'react-document-title';
import { translate } from 'react-i18next';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Navigation from 'components/Navigation';
import UISkipNavigation from 'UI/UISkipNavigation';
import ErrorBoundary from 'components/ErrorBoundary';

import * as links from 'constants/routes';
import Home from './routes/home/containers/Home';
import HealthInsurance from './routes/health-insurance/containers/HealthInsurance';
import Wellness from './routes/wellness/containers/Wellness';
import Care from './routes/care/containers/Care';
import Account from './routes/account/containers/account';
import Authorization from './routes/authorization/containers/Authorization';
import Claims from './routes/claims/containers/Claims';
import LandingPage from './routes/landing-page/containers/LandingPage';
import ClaimsOverview from './routes/claims-overview/containers/ClaimsOverview';
import AppealClaim from './routes/appeal-claim/containers/AppealClaim';
import FindCare from './routes/find-care/containers/FindCare';

import Test from './routes/test/containers/Test';
import Benefits from './routes/benefits/containers/Benefits';
import PageNotFound from "./routes/page-not-found/containers/PageNotFound";
import store from './store/Store';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const setRef = {
  refNav: React.createRef(),
  refContent: React.createRef(),
  refFooter: React.createRef()
};

/*
  Import components to plug-in to the router
  NOTE: routes should be the most spefic to the least spefic
*/


 // this is pretty messy way to go; but context does not appear to work with router 4 :(
    const TitleRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={props => {
            var newProps = {...props, ...rest};
            return (
                <TransitionGroup>
                  <DocumentTitle {...newProps} />
                    <UISkipNavigation {...newProps} setRef={setRef} />
                    <Header {...newProps} />
                    <CSSTransition key={location.pathname.split('/')[1]} timeout={500} classNames="fade" mountOnEnter={true} unmountOnExit={true} >
                    <div class="row"> 
                      <main ref={setRef.refContent} class="main-section columns large-12 medium-12 small-12"  tabIndex="-1" aria-live="polite">
                        <ErrorBoundary><Component {...newProps}/></ErrorBoundary>
                      </main>
                    </div>
                    {/* <div> 
                <div class="row">
              </div>
                <main  ref={setRef.refContent} class="main-section columns large-12 medium-12 small-12">
                  <ErrorBoundary><Component {...newProps}/></ErrorBoundary>
                </main>
              </div> */}
              </CSSTransition>
             <Footer {...newProps} forwardRef={setRef.refFooter} />
          </TransitionGroup>
      )}}/>
);


@translate(['common','header'])
export default class AppRoutes extends Component {
      constructor(props) {
      super(props);
    }
    
    render() {
        const {t} = this.props;
        var props = { title:"supermax" }

        // NOTE: put spefic routes closer to the top as router works
        // by using the first route that "matches" the criteria.
        return (
            <Switch location={this.props.location}>
              <TitleRoute exact={ true } path={links.BENEFITS} title={ t('common:title.benefits') } subtitle={'Benefits Page'} component={Benefits} />
              <TitleRoute exact={ true } path={links.TEST} title={ t('common:title.test') } subtitle={'Test components and other things your curious about'} component={Test} />
              <TitleRoute exact={ true } path={links.HEALTHINSURANCE} title={ t('common:title.healthinsurance') } component={HealthInsurance}/>
              <TitleRoute exact={ true } path={links.WELLNESS} title={ t('common:title.wellness') } component={Wellness}/>
              <TitleRoute exact={ true } path={links.CARE} title={ t('common:title.care') } component={Care}/>
              <TitleRoute exact={ true } path={links.AUTHORIZATION} title={ t('common:title.authorization') } component={Authorization}/>
              <TitleRoute exact={ true } path={links.CLAIMSOVERVIEW} title={ t('common:title.claimsoverview') } component={ClaimsOverview}/>
              <TitleRoute exact={ true } path={links.CLAIMS} title={ t('common:title.claims') } component={Claims}/>
              <TitleRoute exact={ true } path={links.ACCOUNT} title={ t('common:title.account') } component={Account} />
              <TitleRoute exact={ true } path={links.LANDINGPAGE} title={ t('common:title.landingpage') } component={LandingPage}/>             
              <TitleRoute exact={ true } path={links.APPEALCLAIM} title={ t('common:title.appealclaim') } component={AppealClaim} />
              <TitleRoute exact={ true } path={links.FINDCARE} title={ "header:nav.findcare" } component={FindCare} />
              {/* Default Route */}
              <TitleRoute exact={ true } path={links.ROUTE} title={ t('common:title.home') }  component={Home} />
              <TitleRoute title={ t('common:title.pageNotFound') } component={PageNotFound} />
            </Switch>    
        );
  }
}
