import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Link} from 'react-router-dom';

import {LAYOUTS} from 'UI/modules/Enumerations';
import UISelectField from 'UI/UISelectField';
import UIDropSwitch from 'UI/UIDropSwitch';

import * as PaymentActions from 'actions/payments';

import Notification from 'components/Notification';
import ContainerHeader from 'components/ContainerHeader';

import * as GlobalConstants from 'constants/global';
import * as ServiceConstants from 'constants/service';
import * as links from 'constants/routes';

import {getRequiredField} from 'modules/ConstraintHelper';
import {getPaymentDetails} from 'modules/ChoicesHelper';
import {
  getErrorMessage, 
  getTodayDate, 
  confirmConstraints, 
  priceUSDFormat
} from 'modules/Utility';

@translate(['common', 'home', 'payments', 'quickpay'])
class QuickPay extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    let state = {};

    if(props.accountBalances) {      
      const planDetails = props.accountBalances.get(GlobalConstants.PROP_PLAN_DETAILS);

      // If there are any payment methods available, store the flag in local state
      state[GlobalConstants.HAS_WALLET] = props.walletReducer.get(GlobalConstants.PROP_INITIALIZED)
                                            && props.walletReducer.get(GlobalConstants.PROP_PAYMENT_METHODS).size ? true : false;

      state[GlobalConstants.PROP_CONTRACT_IDS] = [];
      // If plan/products are available
      planDetails && 
      planDetails.map((plan) => {
        const contractId  = plan.get(GlobalConstants.PROP_CONTRACT_ID);
        const defaultPayment = props.walletReducer.get(contractId);
        
        const checkStatus = defaultPayment && defaultPayment.get(GlobalConstants.PROP_PRIORITY_PAYMENT_METHOD);

        // If default Payment available to plan/product
        state[GlobalConstants.PROP_PAYMENT_METHOD + '-' + contractId] = defaultPayment && defaultPayment.get('paymentMethodId');
        // Storing all contract IDs (unique to each plan/product) in a array for further operations
        state[GlobalConstants.PROP_CONTRACT_IDS].push(contractId);
        // By default the first plan/product dropdown should be opened if there is any payment default set
        state[GlobalConstants.PROP_PAYMENT_CARD + '-' + contractId] = checkStatus;
        // Plan amount (Send it to service)
        state[GlobalConstants.PROP_PAYMENT_AMOUNT + '-' + contractId] = plan.get(GlobalConstants.PROP_INVOICE_AMT_DUE);
        // Plan Invoice ID (Send it to service)
        state[GlobalConstants.PROP_INVOICE_ID + '-' + contractId] = plan.get(GlobalConstants.PROP_INVOICE_ID);
      });
    }

    console.log('Quickpay state', state);

    return state;
  };

  engressDataTransform = (state, dispatch) => {
    const capturePayment = [];
    const {year, month, date} = getTodayDate(false);

    state[GlobalConstants.PROP_CONTRACT_IDS].map((contractId) => {
      // Redux Store will only have the enabled products/plans data
      if(state[GlobalConstants.PROP_PAYMENT_CARD + '-' + contractId]) {
        const data = {
          [ServiceConstants.AMOUNT_TO_PAY]: state[GlobalConstants.PROP_PAYMENT_AMOUNT + '-' + contractId],
          [ServiceConstants.CIP_ID]: window.config.userInfo.cipId,
          [ServiceConstants.DRY_RUN]: true,
          [ServiceConstants.INVOICE_ID]: state[GlobalConstants.PROP_INVOICE_ID + '-' + contractId],
          [ServiceConstants.NEXT_SCHEDULED_DATE]: `${month}/${date}/${year}`,
          [ServiceConstants.PAYMENT_TOKEN]: state[GlobalConstants.PROP_PAYMENT_METHOD + '-' + contractId],
          [ServiceConstants.SOURCE_SYSTEM]: window.config.sourceSystem,
        }

        capturePayment.push(data);
      }
    });

    const serviceData = {
      [ServiceConstants.CAPTURE_PAYMENT_REQ_LIST]: capturePayment,
      [ServiceConstants.COUNT]: capturePayment.length,
      [ServiceConstants.TYPE]: window.config.paymentType
    };

    dispatch(PaymentActions.saveQuickPaymentInfo(serviceData));
  }

  handleSubmit = () => {
    const v = this.runValidations(this.state);

    if (v) {
      this.setState(...this.state, {
        error: v
      });
    } else {
      //Success! Validation passed.
      //clean state and delete the empty error object if present
      delete this.state.error;
      this.engressDataTransform(this.state, this.props.dispatch);
      this.props.history.push(links.QUICK_CONFIRMATION); //or /screener if "/" doesn't work for same page
    }
  };

  runValidations = (state) => {
    const {t} = this.props;
    let c = {};
    let cardCount = 0; 

    state[GlobalConstants.PROP_CONTRACT_IDS] &&
    state[GlobalConstants.PROP_CONTRACT_IDS].map((id) => {
      // Check if the product/plan is enabled or not
      if(state[GlobalConstants.PROP_PAYMENT_CARD + '-' + id]) {
        const payMethod = GlobalConstants.PROP_PAYMENT_METHOD + '-' + id;
  
        c[payMethod] = getRequiredField(t);
      } else {
        // Increment count, to throw error if all product/plans are turned off
        cardCount++;
      }
    })

    // Check product/plan disabled count with contractID length to stop further actions
    if(cardCount === state[GlobalConstants.PROP_CONTRACT_IDS].length) {
      return GlobalConstants.PROP_ERROR;
    }
    
    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    console.log('UPDATE CONTAINER', key, value);
    this.setState(...this.state, {
      [key]: value,
    });
  };

  togglePaymentCard = (key) => {
    this.setState((state) => {
      return {
        ...state,
        [key]: !state[key]
      };
    });
  }

  renderHelperHeader = (t, plan) => {
    return (
      <div className="row">
        <div className="columns small-8 medium-9 large-10 collapse-padding">
          <h3 className="collapse hl-tiny">
            <strong>{plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_TYPE])}</strong>
          </h3>
          <p className="collapse">{plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_NAME])}: {plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_PLAN_NO])}</p>
          <p className="collapse">{t('payments:due')} {plan.get(GlobalConstants.PROP_INVOICE_DUE_DT)}</p>
        </div>
        <div className="columns small-4 medium-3 large-2 collapse-padding text-right">
          <p className="hl-small collapse badge promo5 inline">{priceUSDFormat(plan.get(GlobalConstants.PROP_PLAN_AMOUNT_DUE))}</p>
        </div>
      </div>
    );
  };

  renderHelperBody = (t, contractId) => {
    const {year, month, date} = getTodayDate(false);
    const paymentMethods = this.state[GlobalConstants.HAS_WALLET] ? this.props.walletReducer.get(GlobalConstants.PROP_PAYMENT_METHODS) : [];

    return (
      <div className="row">
        <div className="columns large-1 medium-1 small-2" />
        <div className="columns large-11 medium-11 small-10 padding-left-3x">
          <div className="row collapse padding-1x padding-bottom-1x">
            <div className="columns large-12 medium-12 small-12">
              <p className="collapse"><strong>{t('payments:paymentDate')} {`${month}/${date}/${year}`}</strong></p>
            </div>
          </div>
          <UISelectField
            label={t('payments:paymentMethod')}
            name={`${GlobalConstants.PROP_PAYMENT_METHOD}-${contractId}`}
            choices={getPaymentDetails(paymentMethods.toJS())}
            defaultValue={this.state[`${GlobalConstants.PROP_PAYMENT_METHOD}-${contractId}`]}
            onValidatedChange={this.update}
            layout={LAYOUTS.COLUMN0}
            errorMessage={getErrorMessage(`${GlobalConstants.PROP_PAYMENT_METHOD}-${contractId}`, this.state.error)} />
        </div>
      </div>
    );
  };

  renderButtons = (t) => {
    return (
      <div className="row">
        <div className="columns medium-6 large-6 small-12">
          <Link to={links.ROUTE} className="button secondary expand-small">
            {t('payments:buttons.cancel')}
          </Link>
        </div>
        <div className="columns medium-6 large-6 small-12 text-right">
          <button className="primary expand-small collapse" onClick={this.handleSubmit}>
            {t('payments:buttons.submitPayment')}
          </button>
        </div>
      </div>
    );
  };

  render() {
    const props = this.props;

    const {t} = props;
    const plans = props.accountBalances.get(GlobalConstants.PROP_PLAN_DETAILS);

    return (
      <Fragment>
        {
          this.state.error === GlobalConstants.PROP_ERROR ? (
            <div className="row">
              <div className="large-12 medium-12 small-12 columns">
                <section className="alert error not-verified" role="alert" id="verifyAlert" aria-label={`${t('errors.errorLabel')} ${t('errors.planSelectError')}`}>
                  <p >
                    <strong>{t('errors.errorLabel')}</strong> {t('errors.planSelectError')}
                  </p>
                </section>
              </div>
            </div>
          ) : ''
        }

        <ContainerHeader title={t('quickpay:title')} />

        <Notification 
          type="success"
          label={t('home:totalPaymentDue')}
          contentSize="hl-xlarge"
          content={priceUSDFormat(props.accountBalances.get(GlobalConstants.PROP_AMOUNT_TO_PAY))} />

        <hr className="circle-center core1" />

        <p>{t('quickpay:selectPlanAndPayment')}</p>

        {
          plans &&
            plans.map((plan) => {
              return (
                <div key={plan.get(GlobalConstants.PROP_CONTRACT_ID)} className="row bottom-1x">
                  <div className="columns small-12">
                    <UIDropSwitch
                      name={`${GlobalConstants.PROP_PAYMENT_CARD}-${plan.get(GlobalConstants.PROP_CONTRACT_ID)}`}
                      ariaLabel={plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_DISPLAY_PLAN_NAME])}
                      label={this.renderHelperHeader(t, plan)}
                      content={this.renderHelperBody(t, plan.get(GlobalConstants.PROP_CONTRACT_ID))}
                      onClick={this.togglePaymentCard}
                      checked={this.state[`${GlobalConstants.PROP_PAYMENT_CARD}-${plan.get(GlobalConstants.PROP_CONTRACT_ID)}`]}
                    />
                  </div>
                </div>
              );
            })
        }

        <hr />

        {this.renderButtons(t)}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {  
  return {
    accountBalances: store.AccountBalancesReducer,
    walletReducer: store.WalletReducer
  };
}

export default connect(mapStateToProps)(QuickPay);