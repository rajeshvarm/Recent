import axios from 'axios';

export const FETCH_CLAIMS_REQUEST = 'FETCH_CLAIMS_REQUEST';
export const FETCH_CLAIMS_SUCCESS = 'FETCH_CLAIMS_SUCCESS';
export const FETCH_CLAIMS_FAILURE = 'FETCH_CLAIMS_FAILURE';
export const FILTER_CLAIMS_DATA = 'FILTER_CLAIMS_DATA';
export const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
export const TOGGLE_LIST = 'TOGGLE_LIST';

export function fetchClaims(request) {
  return function(dispatch) {
    dispatch({
      type: FETCH_CLAIMS_REQUEST
    });

    const partyId = window.config.partyId
    //const url =`/mlp/api/v1/mlpsvc/claims/10000053588?sourceSystem=UI`;

    // switch to complete path if local doesn't respond to relative path 
    const url =`http://mlp-tsta.ose-dev.bcbsfl.com/mlp/api/v1/mlpsvc/claims/10000053588?sourceSystem=UI`
    return axios
       .post(url,request)
      // .get('/data/claimsData.json')
      .then(res => {
          console.log('res', res)
          dispatch({
            type: FETCH_CLAIMS_SUCCESS,
            claimsData: res.data.data.claims || res.data.data
          });
      })
      .catch(error => {
          dispatch({
            type: FETCH_CLAIMS_FAILURE,
            claimsError: error
          });
        console.log("fetchRequestFailed", error);
      });
  }
}

export function closeNotification() {
  return {
    type: CLOSE_NOTIFY,
    payload : {
      hideNotify : true
    }
  }
}

export function toggleList() {
  return {
    type: TOGGLE_LIST,
    payload : {
      isLoaded  : true
    }
  }
}