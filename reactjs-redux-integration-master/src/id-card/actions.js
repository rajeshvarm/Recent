import axios from 'axios';

import * as IDCardConstants from 'constants/idcard';
import * as ServiceConstants from 'constants/service';

export const ID_CARD_REQUEST_INIT = 'ID_CARD_REQUEST_INIT';
export const ID_CARD_REQUEST_SUCCESS = 'ID_CARD_REQUEST_SUCCESS';
export const ID_CARD_REQUEST_FAILURE = 'ID_CARD_REQUEST_FAILURE';

export const requestIDCardService = () => {
  return (dispatch) => {
    dispatch({type: ID_CARD_REQUEST_INIT});

    const url = '/mlp/api/v1/mlpsvc/documents/idCard';
    const {partyId, data = {}} = window.config;

    const plans = (data.memberView && data.memberView.contracts) || [];
    const planName = plans[0] && plans[0].productInfo && plans[0].productInfo[0] && plans[0].productInfo[0].planType;

    const config = {
      params: {
        [ServiceConstants.PARTY_ID]: partyId,
        [ServiceConstants.TRANSACTION_ID]: [ServiceConstants.TRANSACTION_ID_VALUE],
        [ServiceConstants.SOURCE_SYSTEM]: [ServiceConstants.SOURCE_SYSTEM_VALUE],
        [ServiceConstants.TENANT_ID]: [ServiceConstants.TENANT_ID_VALUE],
        [IDCardConstants.CONTRACT_TYPE]: 'Health', // Need to get this value from service
        [IDCardConstants.PLAN_NAME]: planName,
      },
      headers: {
        'content-type': 'application/json',
      },
    };

    return axios
      .get(url, config)
      .then((response) => {
        console.log('ID Card Response:', response);
        const {status, data} = response;
        dispatch(idCardRequestSuccess(status, data));
      })
      .catch((error) => {
        console.log('ID Card Error:', error);
        dispatch(idCardRequestFailure(error));
      });
  };
};

export const idCardRequestSuccess = (status, data) => {
  return {
    type: ID_CARD_REQUEST_SUCCESS,
    status,
    data,
  };
};

export const idCardRequestFailure = (data) => {
  return {
    type: ID_CARD_REQUEST_FAILURE,
    data,
  };
};