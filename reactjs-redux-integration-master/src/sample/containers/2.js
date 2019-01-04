import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Link} from 'react-router-dom';
import MediaQuery from 'react-responsive';

import {LAYOUTS} from 'UI/modules/Enumerations';
import UIInputField from 'UI/UIInputField';
import UISelectField from 'UI/UISelectField';
import UIModal from 'UI/UIModal';
import UIDropSwitch from 'UI/UIDropSwitch';
import UICalendar from 'UI/UICalendar';

import * as PaymentActions from 'actions/payments';

import Notification from 'components/Notification';
import ContainerHeader from 'components/ContainerHeader';
import AddPaymentMethod from 'components/add-payment-method/containers/AddPaymentMethod';

import * as GlobalConstants from 'constants/global';
import * as ServiceConstants from 'constants/service';
import * as links from 'constants/routes';

import {getRequiredDateField, getMoneyRequiredField, getRequiredField} from 'modules/ConstraintHelper';
import {getPaymentDetails} from 'modules/ChoicesHelper';
import {
  getErrorMessage, 
  confirmConstraints, 
  priceUSDFormat, 
  getTodayDate
} from 'modules/Utility';


let count = 0;

@translate(['common', 'home', 'payments'])
class CustomizePayment extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    let state = {};

    if (props.accountBalances) {
      state['modalVisible'] = false;

      const planDetails = props.accountBalances.get(GlobalConstants.PROP_PLAN_DETAILS);

      // If there are any payment methods available, store the flag in local state
      state[GlobalConstants.HAS_WALLET] =
        props.walletReducer.get(GlobalConstants.PROP_INITIALIZED) &&
        props.walletReducer.get(GlobalConstants.PROP_PAYMENT_METHODS).size ? true : false;

      state[GlobalConstants.PROP_CONTRACT_IDS] = [];

      // If plan/products are available
      planDetails &&
        planDetails.map((plan, inx) => {
          const contractId = plan.get(GlobalConstants.PROP_CONTRACT_ID);
          const splitPayment = GlobalConstants.PROP_SPLIT_PAYMENT + '-' + contractId + '-0';
          const defaultPayment = props.walletReducer.get(contractId);
          // If default Payment available to plan/product
          state[splitPayment + '-' + GlobalConstants.PROP_PAYMENT_METHOD] = defaultPayment && defaultPayment.get('paymentMethodId');
          // By default the first plan/product dropdown should be opened
          state[GlobalConstants.PROP_PAYMENT_CARD + '-' + contractId] = inx === 0 ? true : false;
          // Storing all contract IDs (unique to each plan/product) in a array for further operations
          state[GlobalConstants.PROP_CONTRACT_IDS].push(contractId);
          // Plan Invoice ID (Send it to service)
          state[GlobalConstants.PROP_INVOICE_ID + '-' + contractId] = plan.get(GlobalConstants.PROP_INVOICE_ID);
          // Initializing first payment fields for each plan/product
          state[GlobalConstants.PROP_SPLIT_PAYMENTS + '-' + contractId] = [
            splitPayment,
          ];
        });
    }

    console.log('Customize state', state);

    return state;
  };

  engressDataTransform = (state, dispatch) => {
    const capturePayment = [];

    state[GlobalConstants.PROP_CONTRACT_IDS].map((contractId) => {
      // Redux Store will only have the enabled products/plans data
      if(state[GlobalConstants.PROP_PAYMENT_CARD + '-' + contractId]) {
        // Store each split payment details as an object
        state[GlobalConstants.PROP_SPLIT_PAYMENTS + '-' + contractId].map((sp) => {
          const [year, month, date] = state[sp + '-' + GlobalConstants.PROP_PAYMENT_DATE].split('-');

          const data = {
            [ServiceConstants.AMOUNT_TO_PAY]: state[sp + '-' + GlobalConstants.PROP_PAYMENT_AMOUNT],
            [ServiceConstants.CIP_ID]: window.config.userInfo.cipId,
            [ServiceConstants.DRY_RUN]: true,
            [ServiceConstants.INVOICE_ID]: state[GlobalConstants.PROP_INVOICE_ID + '-' + contractId],
            [ServiceConstants.NEXT_SCHEDULED_DATE]: `${year}/${month}/${date}`,
            [ServiceConstants.PAYMENT_TOKEN]: state[sp + '-' + GlobalConstants.PROP_PAYMENT_METHOD],
            [ServiceConstants.SOURCE_SYSTEM]: window.config.sourceSystem,
          }

          capturePayment.push(data);
        });
      }
    });

    const serviceData = {
      [ServiceConstants.CAPTURE_PAYMENT_REQ_LIST]: capturePayment,
      [ServiceConstants.COUNT]: capturePayment.length,
      [ServiceConstants.TYPE]: window.config.paymentType
    };

    dispatch(PaymentActions.saveCustomizePaymentInfo(serviceData));
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
      this.props.history.push(links.CUSTOMIZE_REVIEW); //or /screener if "/" doesn't work for same page
    }
  };

  runValidations = (state) => {
    const {t} = this.props;
    let c = {};
    let cardCount = 0;

    state[GlobalConstants.PROP_CONTRACT_IDS] &&
      state[GlobalConstants.PROP_CONTRACT_IDS].map((contractId) => {
        // Check if the product/plan is enabled or not
        if (state[GlobalConstants.PROP_PAYMENT_CARD + '-' + contractId]) {
          state[GlobalConstants.PROP_SPLIT_PAYMENTS + '-' + contractId].map((sp) => {
            // sp - split payment
            const paymentDate = sp + '-' + GlobalConstants.PROP_PAYMENT_DATE;
            const amount = sp + '-' + GlobalConstants.PROP_PAYMENT_AMOUNT;

            if (state[GlobalConstants.HAS_WALLET]) {
              const payMethod = sp + '-' + GlobalConstants.PROP_PAYMENT_METHOD;
              c[payMethod] = getRequiredField(t);
            }
            // Use `getRequiredDateField` for Date validation to support Safari and IE
            // Note: HTML5 Calendar doesn't support in Safari and IE, it fallbacks to text field.
            c[paymentDate] = getRequiredDateField(t);
            c[amount] = getMoneyRequiredField(t);
          });
        } else {
          // Increment count, to throw error if all product/plans are turned off
          cardCount++;
        }
      });

    // Check product/plan disabled count with contractID length to stop further actions
    if (cardCount === state[GlobalConstants.PROP_CONTRACT_IDS].length) {
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

  handleSplitPayment = (key, value) => {
    this.setState((prevState) => {
      if (prevState[key].length > 4) {
        return;
      }

      return {
        ...prevState,
        [key]: [...prevState[key], value + '-' + ++count],
      };
    }, () => {
      console.log('UPDATE SPLIT PAYMENTS', this.state[key]);
    });
  };

  removeSplitPayment = (key, value) => {
    console.log('REMOVE SPLIT PAYMENT', value);
    this.setState((prevState) => {
      const stateClone = prevState[key].filter((x) => x !== value);
      delete prevState[value + '-' + GlobalConstants.PROP_PAYMENT_DATE];
      delete prevState[value + '-' + GlobalConstants.PROP_PAYMENT_AMOUNT];

      return {
        ...prevState,
        [key]: [...stateClone],
      }}, () => {
        this.toggleDialogVisibility();
      }
    );
  };

  toggleDialogVisibility = (key = null, value = null) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        modalVisible: !prevState.modalVisible,
        removePaymentKey: key,
        removePaymentValue: value,
      };
    });
  };

  togglePaymentCard = (key) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        [key]: !prevState[key],
      };
    });
  };

  renderHelperHeader = (t, plan) => {
    return (
      <div className="row">
        <div className="columns small-8 medium-9 large-9 collapse-padding">
          <h3 className="collapse hl-tiny">
            <strong>{plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_TYPE])}</strong>
          </h3>
          <p className="collapse">
            {plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_NAME])}:{' '}
            {plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_PRODUCT_PLAN_NO])}
          </p>
          <p className="collapse">
            {t('payments:due')} {plan.get(GlobalConstants.PROP_INVOICE_DUE_DT)}
          </p>
        </div>
        <div className="columns small-4 medium-3 collapse-padding text-right">
          <p className="hl-medium collapse text-right price">
            {priceUSDFormat(plan.get(GlobalConstants.PROP_PLAN_AMOUNT_DUE))}
          </p>
        </div>
      </div>
    );
  };

  renderAddPaymentDate = (t, data) => {
    const {key, value, paymentNum, paymentMethods, contractId} = data;
    const paymentLength = this.state[key].length;
    const paymentAmount = this.state[value + '-' + GlobalConstants.PROP_PAYMENT_AMOUNT] || '';

    return (
      <div
        className="panel remove collapse"
        id={value}
        key={value}
        aria-labelledby={paymentLength > 1 ? `panel-${value}` : null}>
        {paymentLength > 1 ? (
          <div className="head">
            <h4 className="hl-tiny collapse" id={`panel-${value}`}>
              <strong>
                {t('payments:paymentsLabel')}
                {paymentNum}
              </strong>
            </h4>
            <button
              className="close"
              title={t('payments:deleteSplitPayment')}
              aria-label={t('payments:deleteSplitPayment')}
              aria-controls={value}
              aria-expanded="true"
              aria-haspopup="dialog"
              onClick={this.toggleDialogVisibility.bind(this, key, value)}>
              <span className="icon icon-remove" aria-hidden="true" />
            </button>
          </div>
        ) : (
          ''
        )}
        <div className="body padding-right-1x">
          <div className="row">
            <UICalendar
              label={t('payments:paymentDate')}
              name={`${value}-${GlobalConstants.PROP_PAYMENT_DATE}`}
              min={getTodayDate()}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT4}
              errorMessage={getErrorMessage(`${value}-${GlobalConstants.PROP_PAYMENT_DATE}`, this.state.error)}
            />
            <UIInputField
              label={t('payments:paymentamount')}
              type="number"
              name={`${value}-${GlobalConstants.PROP_PAYMENT_AMOUNT}`}
              value={paymentAmount}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT4}
              errorMessage={getErrorMessage(`${value}-${GlobalConstants.PROP_PAYMENT_AMOUNT}`, this.state.error)}
            />
          </div>
          {this.state[GlobalConstants.HAS_WALLET] ? (
            <UISelectField
              label={t('payments:paymentMethod')}
              name={`${value}-${GlobalConstants.PROP_PAYMENT_METHOD}`}
              choices={getPaymentDetails(paymentMethods.toJS())}
              defaultValue={this.state[`${value}-${GlobalConstants.PROP_PAYMENT_METHOD}`]}
              onValidatedChange={this.update}
              layout={LAYOUTS.COLUMN0}
              errorMessage={getErrorMessage(`${value}-${GlobalConstants.PROP_PAYMENT_METHOD}`, this.state.error)}
            />
          ) : (
            <div className="bottom-1x">
              <p>
                {t('payments:paymentMethod')} <br />
                <strong>{t('payments:noPaymentMethod')}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  renderHelperBody = (t, contractId) => {
    const key = GlobalConstants.PROP_SPLIT_PAYMENTS + `-${contractId}`;
    const value = GlobalConstants.PROP_SPLIT_PAYMENT + `-${contractId}`;
    const paymentMethods = this.state[GlobalConstants.HAS_WALLET]
      ? this.props.walletReducer.get(GlobalConstants.PROP_PAYMENT_METHODS)
      : [];
    return (
      <MediaQuery minDeviceWidth={700}>
        {(matches) => {
          if (matches) {
            return (
              <Fragment>
                <div className="row collapse">
                  <div className="columns large-1 medium-1" />
                  <div className="columns large-11 medium-11 padding-left-1x">
                    {this.state[key].length
                      ? this.state[key].map((value, inx) => {
                          const data = {key, value, paymentNum: inx + 1, paymentMethods, contractId};
                          return this.renderAddPaymentDate(t, data);
                        })
                      : ''}
                  </div>
                </div>
                <div className="row collapse">
                  <div className="columns large-1 medium-1" />
                  <div className="columns large-11 medium-11 padding-left-1x">
                    <div className="row collapse">
                      <div className="columns large-4 medium-5 right-1x">
                        <AddPaymentMethod contractId={contractId} />
                      </div>
                      <div className="columns large-7 medium-6">
                        <button className="button secondary" onClick={this.handleSplitPayment.bind(this, key, value)}>
                          {t('payments:addAnotherPaymentDate')}
                          <span className="icon-calendar left-1x" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <div className="row">
                  <div className="columns small-2" />
                  <div className="columns small-10">
                    {this.state[key].length
                      ? this.state[key].map((value, inx) => {
                          const data = {key, value, paymentNum: inx + 1, paymentMethods, contractId};
                          return this.renderAddPaymentDate(t, data);
                        })
                      : ''}
                  </div>
                </div>
                <div className="row collapse">
                  <div className="columns small-2" />
                  <div className="columns small-10">
                    <div className="row">
                      <div className="columns small-12">
                        <AddPaymentMethod contractId={contractId} />
                      </div>
                      <div className="columns small-12">
                        <button
                          className="button secondary expand"
                          onClick={this.handleSplitPayment.bind(this, key, value)}>
                          {t('payments:addAnotherPaymentDate')}
                          <span className="icon-calendar left-1x" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          }
        }}
      </MediaQuery>
    );
  };

  renderButton = (t) => {
    return (
      <div className="row">
        <div className="columns medium-6">
          <Link to={links.ROUTE} className="button secondary expand-small">
            {t('button.cancel')}
          </Link>
        </div>
        <div className="columns medium-6 text-right">
          <button className="primary collapse expand-small" onClick={this.handleSubmit}>
            {t('payments:reviewpayment')}
          </button>
        </div>
      </div>
    );
  };

  renderDeletePaymentModal = (t) => {
    const key = this.state.removePaymentKey;
    const value = this.state.removePaymentValue;
    return (
      <UIModal visible={this.state.modalVisible} onExit={this.toggleDialogVisibility}>
        <div className="row head">
          <div className="columns small-11 padding-2x padding-bottom-2x">
            <h2 id="modal-title" className="hl-medium">
              {t('payments:removeModalTitle')}
            </h2>
          </div>
          <div className="columns small-1">
            <button
              type="button"
              aria-label="close-dialog"
              title="close-dialog"
              onClick={this.toggleDialogVisibility}
            />
          </div>
        </div>
        <div className="row body">
          <p className="padding-left-2x">{t('payments:removePaymentText')}</p>
        </div>
        <div className="row footer">
          <div className="columns large-6 medium-6">
            <button className="secondary" onClick={this.toggleDialogVisibility}>
              {t('payments:buttons.close')}
            </button>
          </div>
          <div className="columns large-6 medium-6 text-right">
            <button className="primary" onClick={this.removeSplitPayment.bind(this, key, value)}>
              {t('payments:buttons.confirm')}
            </button>
          </div>
        </div>
      </UIModal>
    );
  };

  render() {
    const {t} = this.props;
    const plans = this.props.accountBalances.get(GlobalConstants.PROP_PLAN_DETAILS);
    const paymentLabel = this.state[GlobalConstants.HAS_WALLET] ? t('payments:title') : t('payments:title2');

    return (
      <Fragment>
        {this.renderDeletePaymentModal(t)}

        {this.state.error === GlobalConstants.PROP_ERROR ? (
          <div className="row">
            <div className="large-12 medium-12 small-12 columns">
              <section
                className="alert error not-verified"
                role="alert"
                id="verifyAlert"
                aria-label={`${t('errors.errorLabel')} ${t('errors.planSelectError')}`}>
                <p>
                  <strong>{t('errors.errorLabel')}</strong> {t('errors.planSelectError')}
                </p>
              </section>
            </div>
          </div>
        ) : (
          ''
        )}

        <ContainerHeader title={paymentLabel} />

        <Notification
          type="success"
          label={t('home:totalPaymentDue')}
          contentSize="hl-xlarge"
          content={priceUSDFormat(this.props.accountBalances.get(GlobalConstants.PROP_AMOUNT_TO_PAY))} />

        <hr className="circle-center core1" />

        <p>{t('payments:taptoseedetails')}</p>

        {plans &&
          plans.map((plan) => {
            const contractID = plan.get(GlobalConstants.PROP_CONTRACT_ID);
            return (
              <div key={contractID} className="row bottom-1x">
                <div className="columns small-12">
                  <UIDropSwitch
                    name={`${GlobalConstants.PROP_PAYMENT_CARD}-${contractID}`}
                    ariaLabel={plan.getIn([GlobalConstants.PROP_PRODUCTS, 0, GlobalConstants.PROP_DISPLAY_PLAN_NAME])}
                    label={this.renderHelperHeader(t, plan)}
                    content={this.renderHelperBody(t, contractID)}
                    onClick={this.togglePaymentCard}
                    checked={this.state[`${GlobalConstants.PROP_PAYMENT_CARD}-${contractID}`]} />
                </div>
              </div>
            );
          })}
        <hr />
        {this.renderButton(t)}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    accountBalances: store.AccountBalancesReducer,
    walletReducer: store.WalletReducer,
  };
}

export default connect(mapStateToProps)(CustomizePayment);
