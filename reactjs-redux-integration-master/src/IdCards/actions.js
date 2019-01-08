import axios from 'axios';

export const INIT_ID_CARD_REQUEST = 'INIT_ID_CARD_REQUEST';
export const ID_CARD_REQUEST_COMPLETE = 'ID_CARD_REQUEST_COMPLETE';
export const ID_CARD_REQUEST_FAIL = 'ID_CARD_REQUEST_FAIL';

export const initIDCardRequest = () => {
  return {
    type: INIT_ID_CARD_REQUEST,
  };
};

export const idCardRequestComplete = (status, data) => {
  return {
    type: ID_CARD_REQUEST_COMPLETE,
    status,
    data,
  };
};

export const idCardRequestFail = (data) => {
  return {
    type: ID_CARD_REQUEST_FAIL,
    data,
  };
};

export const requestIDCardService = () => {
  return (dispatch) => {
    dispatch(initIDCardRequest());

    const url = './data/idCard.json';
    const method = 'GET';

    return axios[method.toLowerCase()](url, config)
      .then((response) => {
        console.log('ID Card Response:', response);
        const {status, data} = response;
        dispatch(idCardRequestComplete(status, data));
      })
      .catch((error) => {
        console.log('ID Card Error:', error);
        dispatch(idCardRequestFail(error));
      });
  };
};