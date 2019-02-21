import { Map } from 'immutable';

import * as ClaimsConstants from 'constants/claims'; 
import * as GlobalConstants from 'constants/global';
import * as Actions from './actions';
import {priceUSDFormat} from 'modules/Utility';

const INITIAL_STATE = new Map({
  [GlobalConstants.PROP_FETCHING]: false,
  [GlobalConstants.PROP_ERROR]: false,
  [ClaimsConstants.PROP_CLAIMS_DATA]: [],
  [ClaimsConstants.PROP_FILTERS]: {},
  [ClaimsConstants.PROP_COLUMNS]: [],
  [ClaimsConstants.PROP_FILTERED_DATA]: [],
  [ClaimsConstants.PROP_ISLOADED]: false,
  [ClaimsConstants.PROP_HIDE_NOTIFY]: false
  });
  
  const ClaimsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Actions.FETCH_CLAIMS_REQUEST:
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, true)
          m.set(GlobalConstants.PROP_ERROR, false)
        });

      case Actions.FETCH_CLAIMS_SUCCESS:
        const { claimsData } = action;
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, false),
          m.set(GlobalConstants.PROP_ERROR, false),
          m.set(ClaimsConstants.PROP_CLAIMS_DATA, claimsData)
          m.set(ClaimsConstants.PROP_FILTERED_DATA, claimsData)
          m.set(ClaimsConstants.PROP_FILTERS, action.filters)
          m.set(ClaimsConstants.PROP_TOTAL_COUNT, action.totalCount)
        });
      case Actions.FETCH_CLAIMS_FAILURE:
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, false)
          m.set(GlobalConstants.PROP_ERROR, true),
          m.set(GlobalConstants.PROP_ERROR, action.claimsError)
        });
        
      case Actions.FILTER_CLAIMS_DATA:
        // Providing error message to state, to be able display it in UI.
        return state.withMutations(m => {
          m.set(ClaimsConstants.PROP_FILTERED_DATA, action.payload.filteredData)
          m.set(ClaimsConstants.PROP_ISLOADED,false)
      });
      
      case Actions.CLOSE_NOTIFY:
        return state.set(ClaimsConstants.PROP_HIDE_NOTIFY, true)

      case Actions.TOGGLE_LIST:
        return state.set(ClaimsConstants.PROP_ISLOADED, action.payload.isLoaded)
          
      default:
        return state;
    }
  }
  
  export default ClaimsReducer;
  