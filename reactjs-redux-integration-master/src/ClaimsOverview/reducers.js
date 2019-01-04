import * as ClaimOverviewConstants from 'constants/claims'; 
import * as GlobalConstants from 'constants/global';
import * as Actions from './actions';


const INITIAL_STATE = {
    [ClaimOverviewConstants.PROP_CLAIM_OVERVIEW_DATA]: {},
    [ClaimOverviewConstants.PROP_ISLOADED]: false,
    [GlobalConstants.PROP_FETCHING]: false
  };
  
  const ClaimOverviewReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Actions.FETCH_CLAIM_OVERVIEW_REQUEST:
        return Object.assign({}, state, {
            [GlobalConstants.PROP_FETCHING]: true
        });
  
        case Actions.FETCH_CLAIM_OVERVIEW_SUCCESS:
        let data = {...action.claimOverviewData};
        return Object.assign({}, state, {
            [GlobalConstants.PROP_FETCHING]: false,
            [ClaimOverviewConstants.PROP_CLAIM_OVERVIEW_DATA]: data
        });
      default:
        return state;
    }
  }
  
  export default ClaimOverviewReducer;