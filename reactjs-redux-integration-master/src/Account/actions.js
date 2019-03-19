import axios from 'axios';

export const ACCOUNT_DETAIL_REQUEST_INIT = 'ACCOUNT_DETAIL_REQUEST_INIT';
export const ACCOUNT_DETAIL_REQUEST_SUCCESS = 'ACCOUNT_DETAIL_REQUEST_SUCCESS';
export const ACCOUNT_DETAIL_REQUEST_FAILURE = 'ACCOUNT_DETAIL_REQUEST_FAILURE';


export const fetchAccountDetails = () => {
  return (dispatch) => {
    dispatch({ type: ACCOUNT_DETAIL_REQUEST_INIT });

    const url = "/mlp/api/v1/mlpsvc/member/accountProfiles";
    const { partyId, transactionId, sourceSystem } = window.config;
    const config = {
      params: {
        partyId,
        transactionId,
        sourceSystem
      },
      headers: {
        'content-type': 'application/json'
      }
    }

    //  switch to complete path if local doesn't respond to relative path
    //  const url = `http://mlpapi-tsta.ose-dev.bcbsfl.com/mlp/api/v1/mlpsvc/member/accountProfiles`;
    return axios.get(url, config)
      .then((response) => {
        console.log('Account Details Response:', response);
        const {status, data} = response;
        dispatch(accountDetailSuccess(status, data));
      })
      .catch((error) => {
        console.log('Account Details Error:', error);
        dispatch(accountDetailFailure(error));
      });
  };
};

export const accountDetailSuccess = (status, data) => {
  return {
    type: ACCOUNT_DETAIL_REQUEST_SUCCESS,
    status,
    data,
  };
};

export const accountDetailFailure = (data) => {
  return {
    type: ACCOUNT_DETAIL_REQUEST_FAILURE,
    data,
  };
};