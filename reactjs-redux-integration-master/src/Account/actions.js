import axios from 'axios';

export const FETCH_ACCOUNT_DETAIL_REQUEST = 'FETCH_ACCOUNT_DETAIL_REQUEST';
export const FETCH_ACCOUNT_DETAIL_SUCCESS = 'FETCH_ACCOUNT_DETAIL_SUCCESS';
export const FETCH_ACCOUNT_DETAIL_FAILURE = 'FETCH_ACCOUNT_DETAIL_FAILURE';

export const fetchAccountDetailSuccess = (status, data) => {
  return {
    type: FETCH_ACCOUNT_DETAIL_SUCCESS,
    status,
    data,
  };
};

export const fetchAccountDetailFailure = (data) => {
  return {
    type: FETCH_ACCOUNT_DETAIL_FAILURE,
    data,
  };
};

export const fetchAccountDetails = () => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ACCOUNT_DETAIL_REQUEST,
    });

    return axios
      .get('data/accountProfile.json')
      .then((response) => {
        console.log('Account Details Response:', response);
        const {status, data} = response;
        dispatch(fetchAccountDetailSuccess(status, data));
      })
      .catch((error) => {
        console.log('Account Details Error:', error);
        dispatch(fetchAccountDetailFailure(error));
      });
  };
};
