import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import AppRoutes from './routes';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

//import react router dependents
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import { translate, I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // initialized i18next instance
import store from './store/Store';
import axios from 'axios';
import { Provider } from 'react-redux';
import UIInitialization from 'UI/UIInitialization';


//import page-layout wrapper (nav, actionbar, sidebar, footer, etc.)
import Layout from "components/Layout";

const App = () => (
    <Provider store={store} key="provider">
        <I18nextProvider i18n={i18n}>
            <UIInitialization
                onInitComplete={(status, data) => window.config = data}
                initURL={`http://wks41b6049:3100/public/initData-mlp.json`} >
                <Layout>
                    <Router>
                        <Route render={({ location }) => (
                            <AppRoutes location={location} />
                        )} />
                    </Router>
                </Layout>
            </UIInitialization>
        </I18nextProvider>
    </Provider>
);

render(<App />, document.getElementById('app'));
