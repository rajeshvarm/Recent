import { Map, fromJS } from 'immutable';

import * as ClaimOverviewConstants from 'constants/claims'; 
import * as GlobalConstants from 'constants/global';
import * as Actions from './actions';


const INITIAL_STATE = new Map({
    [ClaimOverviewConstants.PROP_ISLOADED]: false,
    [GlobalConstants.PROP_FETCHING]: false
  });
  
  const ClaimOverviewReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Actions.FETCH_CLAIM_OVERVIEW_REQUEST:
        return state.set(GlobalConstants.PROP_FETCHING, true)
  
      case Actions.FETCH_CLAIM_OVERVIEW_SUCCESS:
        let data = fromJS(action.claimOverviewData);
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, false)
          m.set(ClaimOverviewConstants.PROP_CLAIM_OVERVIEW_DATA, data)
        });
      
      default:
        return state;
    }
  }
  
  export default ClaimOverviewReducer;