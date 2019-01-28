import * as ClaimsConstants from 'constants/claims'; 
import * as GlobalConstants from 'constants/global';
import * as Actions from './actions';
import {priceUSDFormat} from 'modules/Utility';

const INITIAL_STATE = {
  [ClaimsConstants.PROP_CLAIMS_DATA]: [],
  [ClaimsConstants.PROP_FILTERS]: [],
  [ClaimsConstants.PROP_COLUMNS]: [],
  [ClaimsConstants.PROP_FILTERED_DATA]: [],
  [ClaimsConstants.PROP_ISLOADED]: false,
  [ClaimsConstants.PROP_HIDE_NOTIFY]: false
  };
  
  const ClaimsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Actions.FETCH_CLAIMS_REQUEST:
        return Object.assign({}, state, {
          [GlobalConstants.PROP_FETCHING]: true
        });
      case Actions.FETCH_CLAIMS_SUCCESS:
        return Object.assign({}, state, {
          [GlobalConstants.PROP_FETCHING]: false,
          [ClaimsConstants.PROP_CLAIMS_DATA]: action.claimsData,
          [ClaimsConstants.PROP_FILTERED_DATA]: [...action.claimsData]
        });
      case Actions.FETCH_CLAIMS_FAILURE:
        return Object.assign({}, state, {
          [GlobalConstants.PROP_FETCHING]: false,
          [GlobalConstants.PROP_ERROR]: action.error
        });
        case Actions.FILTER_CLAIMS_DATA:
      // Providing error message to state, to be able display it in UI.
      console.log('action', action)
      return Object.assign({}, state, {
        [ClaimsConstants.PROP_FILTERED_DATA]: action.payload.filteredData,
        [ClaimsConstants.PROP_ISLOADED]:false
      });
      
      case Actions.CLOSE_NOTIFY:
        return Object.assign({}, state, {
          [ClaimsConstants.PROP_HIDE_NOTIFY]: true
        });
  
        case Actions.TOGGLE_LIST:
        return Object.assign({}, state, {
          [ClaimsConstants.PROP_ISLOADED]: action.payload.isLoaded
        });

      default:
        return state;
    }
  }
  
  export default ClaimsReducer;
  