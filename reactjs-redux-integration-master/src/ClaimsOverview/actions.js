import axios from 'axios';

export const FETCH_CLAIM_OVERVIEW_REQUEST = 'FETCH_CLAIM_OVERVIEW_REQUEST';
export const FETCH_CLAIM_OVERVIEW_SUCCESS = 'FETCH_CLAIM_OVERVIEW_SUCCESS';
export const FETCH_CLAIM_OVERVIEW_FAILURE = 'FETCH_CLAIM_OVERVIEW_FAILURE';


export function fetchClaimOverview() {
  return function(dispatch) {
    dispatch({
      type: FETCH_CLAIM_OVERVIEW_REQUEST
    });
    // const url ="http://mlp-unta.ose-dev.bcbsfl.com/mlp/api/v1/mlpsvc/claims/details/10000053588/10001?transactionId=1001&sourceSystem=UI";
    return axios
      .get('../data/claimsOverviewData.json')
      .then(res => {
          console.log('res', res.data)
          dispatch({
            type: FETCH_CLAIM_OVERVIEW_SUCCESS,
            claimOverviewData: res.data
          });
      })
      .catch(error => {
          dispatch({
            type: FETCH_CLAIM_OVERVIEW_FAILURE,
            authError: body.error
          });
        console.log("fetchRequestFailed", error);
      });
  }
}