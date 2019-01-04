import axios from 'axios';
import {fromJS} from 'immutable';

import * as GlobalConstants from 'constants/global';

import * as ServiceActions from 'actions/service';

export const REQUEST_INIT_WALLET = 'REQUEST_INIT_WALLET';
export const REQUEST_WALLET_COMPLETE = 'REQUEST_WALLET_COMPLETE';
export const REQUEST_WALLET_FAIL = 'REQUEST_WALLET_FAIL';
export const REQUEST_INIT_ADD_NEW_PAYMENT_METHOD = 'REQUEST_INIT_ADD_NEW_PAYMENT_METHOD';
export const REQUEST_ADD_NEW_PAYMENT_METHOD_COMPLETE = 'REQUEST_ADD_NEW_PAYMENT_METHOD_COMPLETE';
export const ADD_TO_WALLET_TEMP = 'ADD_TO_WALLET_TEMP';

export const initWalletRequest = () => {
  return {
    type: REQUEST_INIT_WALLET,
  };
};

export const walletRequestComplete = (status, data) => {
  return {
    type: REQUEST_WALLET_COMPLETE,
    status,
    data,
  };
};

export const walletRequestFail = (status, data) => {
  return {
    type: REQUEST_WALLET_FAIL,
    status,
    data,
  };
};

export const requestWallet = () => {
  const cip = '123456789';
  return (dispatch) => {
    dispatch(initWalletRequest());

    const api = window.config.apis.find((api) => api.key === 'getPaymentMethods');
    const {url: endpoint, method} = api;
    const config = {params: {cipId: cip, dryRun: true}};

    return axios[method.toLowerCase()](endpoint, config)
      .then((response) => {
        console.log('requestWallet response', response);
        dispatch(
          walletRequestComplete(
            response.status,
            fromJS(ingressDataTransform(response.data[GlobalConstants.PROP_PAYMENT_METHOD_RESPONSE]))
          )
        );
      })
      .catch((error) => {
        dispatch(walletRequestFail(error));
      });
  };
};

const ingressDataTransform = (paymentMethodResponse) => {
  let transformedData = {
    [GlobalConstants.IS_QUICK_PAY_ENABLED]: false, // By default Quick Pay is hidden from UI
    [GlobalConstants.IS_CUSTOMIZE_ENABLED]: false, // By default `Customize Payment` will be shown as `Make Payment`
    [GlobalConstants.PROP_PAYMENT_METHODS]: [], // Will store all Payments in here and we use `Payment Allowed Rules` to show payments accordingly
  };

  let paymentMethods = [];

  paymentMethodResponse.map((product) => {
    // All payments available for a product
    const productPayments = product.PaymentToken;
    paymentMethods.push(...productPayments);
    // Filter if the product as default payment
    const productDefault = productPayments.filter((x) => (x[GlobalConstants.PROP_PRIORITY_PAYMENT_METHOD] ? x : ''));
    // Save the product default payment with contractId for easy mapping
    transformedData[product.contractId] = productDefault[0];
    // If any one plan/product have default payment, `Quick Pay` will be shown
    if (productDefault[0]) {
      transformedData[GlobalConstants.IS_QUICK_PAY_ENABLED] = true;
    }
    

    const unique = [];
    transformedData[GlobalConstants.PROP_PAYMENT_METHODS] = paymentMethods.filter((data) => {
      if(unique.indexOf(data.paymentMethodId) < 0) {
        unique.push(data.paymentMethodId);
        return true;
      }
      return false;
    })

    // If there are any payment methods available, `Make Payment` Label will change to `Customize Payment`
    if (paymentMethods.length) {
      transformedData[GlobalConstants.IS_CUSTOMIZE_ENABLED] = true;
    }
  });

  return transformedData;
};

export const initAddNewPaymentMethodRequest = () => {
  return {
    type: REQUEST_INIT_ADD_NEW_PAYMENT_METHOD,
  };
};

export const requestAddNewPaymentMethod = (data) => {
  return (dispatch) => {
    dispatch(initAddNewPaymentMethodRequest());

    const api = window.config.apis.find((obj) => obj.key == 'savePaymentMethods');
    const {method, url} = api;

    const headers = {headers: {'content-type': 'application/json'}};
    const payloadData = data;
    return axios[method.toLowerCase()](url, payloadData, headers)
      .then((response) => {
        console.log('Payment Saved', response);
        dispatch(addNewPaymentMethodRequestComplete(response));
        dispatch(requestWallet());
      })
      .catch((error) => {
        console.log('Error', error);
        dispatch(addNewPaymentMethodRequestComplete(error));
      });
  };
};

export const addNewPaymentMethodRequestComplete = (data) => {
  return {
    type: REQUEST_ADD_NEW_PAYMENT_METHOD_COMPLETE,
    data,
  };
};

export const addToWalletTemp = (data) => {
  return {
    type: ADD_TO_WALLET_TEMP,
    data,
  };
};

export const updateDefaultPaymentMethod = (data) => {
  return (dispatch) => {
    dispatch(ServiceActions.initServiceRequest());

    const api = window.config.apis.find((api) => api.key === 'updatePaymentMethods');
    const {url: endpoint, method} = api;
    const payload = data;
    const headers = {headers: {'content-type': 'application/json'}};

    return axios[method.toLowerCase()](endpoint, payload, headers)
      .then((response) => {
        console.log('Update Payment Method Success', response);
        dispatch(ServiceActions.serviceRequestComplete(response.status, response.data));
      })
      .catch((error) => {
        console.log('Update Payment Method Fail', error);
        dispatch(ServiceActions.serviceRequestFail(error));
      });
  };
};

export const requestDeletePaymentMethod = (data) => {
  return (dispatch) => {
    dispatch(ServiceActions.initServiceRequest());

    const api = window.config.apis.find((api) => api.key === 'deletePaymentMethods');
    let {url: endpoint, method} = api;
    const config = {params: {...data}};

    endpoint = endpoint.replace('{paymentScheduleId}', data.PaymentToken);

    return axios[method.toLowerCase()](endpoint, config)
      .then((response) => {
        console.log('Delete Payment Method Success', response);
        dispatch(ServiceActions.serviceRequestComplete(response.status, response.data));
      })
      .catch((error) => {
        console.log('Delete Payment Method Fail', error);
        dispatch(ServiceActions.serviceRequestFail(error));
      });
  };
};