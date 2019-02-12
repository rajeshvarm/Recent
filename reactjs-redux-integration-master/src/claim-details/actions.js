import axios from 'axios';

export const FETCH_CLAIM_OVERVIEW_REQUEST = 'FETCH_CLAIM_OVERVIEW_REQUEST';
export const FETCH_CLAIM_OVERVIEW_SUCCESS = 'FETCH_CLAIM_OVERVIEW_SUCCESS';
export const FETCH_CLAIM_OVERVIEW_FAILURE = 'FETCH_CLAIM_OVERVIEW_FAILURE';


export function fetchClaimOverview() {
  return function (dispatch) {
    dispatch({
      type: FETCH_CLAIM_OVERVIEW_REQUEST
    });

    const partyId = window.config.partyId
    const url = `/mlp/api/v1/mlpsvc/claims/details/${partyId}/10001?transactionId=1234&sourceSystem=UI`;

    // switch to complete path if local doesn't respond to relative path 
    //const url = `http://mlp-tsta.ose-dev.bcbsfl.com/mlp/api/v1/mlpsvc/claims/details/${partyId}/10001?transactionId=1234&sourceSystem=UI`
    return axios
      .get(url)
      .then(res => {
          console.log('res claimDetail', res.data)
          dispatch({
            type: FETCH_CLAIM_OVERVIEW_SUCCESS,
            claimOverviewData: res.data.data
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