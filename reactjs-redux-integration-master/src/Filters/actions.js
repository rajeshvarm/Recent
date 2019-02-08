import axios from 'axios';

export const FETCH_FILTER_REQUEST = 'FETCH_FILTER_REQUEST';
export const FETCH_FILTER_SUCCESS = 'FETCH_FILTER_SUCCESS';
export const FETCH_FILTER_FAILURE = 'FETCH_FILTER_FAILURE';

export function fetchFilters() {
  return function(dispatch) {
    dispatch({
      type: FETCH_FILTER_REQUEST
    });

    const partyId = window.config.partyId
    //const url =`/mlp/api/v1/mlpsvc/claims/filterdata/${partyId}?transactionId=1234&sourceSystem=UI`;
    
    // switch to complete path if local doesn't respond to relative path 
    const url =`http://mlp-tsta.ose-dev.bcbsfl.com/mlp/api/v1/mlpsvc/claims/filterdata/10000053588?transactionId=1234&sourceSystem=UI`
    return axios
    //read only call
      //.get('../data/filterData.json')
      .get(url)
      .then(res => {
          console.log('res filter', res)
          dispatch({
            type: FETCH_FILTER_SUCCESS,
            filterData: res.data.data
          });
      })
      .catch(error => {
          dispatch({
            type: FETCH_FILTER_FAILURE,
            authError: error
          });
        console.log("fetchRequestFailed", error);
      });
  }
}
