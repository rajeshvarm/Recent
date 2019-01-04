import axios from 'axios';

export const FETCH_FILTER_REQUEST = 'FETCH_FILTER_REQUEST';
export const FETCH_FILTER_SUCCESS = 'FETCH_FILTER_SUCCESS';
export const FETCH_FILTER_FAILURE = 'FETCH_FILTER_FAILURE';

export function fetchFilters() {
  return function(dispatch) {
    dispatch({
      type: FETCH_FILTER_REQUEST
    });
    return axios
      .get('../data/filterData.json')
      .then(res => {
          console.log('res filter', res)
          dispatch({
            type: FETCH_FILTER_SUCCESS,
            filterData: res.data.data.filterData
          });
      })
      .catch(error => {
          dispatch({
            type: FETCH_FILTER_FAILURE,
            authError: body.error
          });
        console.log("fetchRequestFailed", error);
      });
  }
}
