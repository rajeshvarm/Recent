import { Map, fromJS } from 'immutable';

import * as Actions from './actions';
import * as ClaimsConstants from 'constants/claims'; 
import * as GlobalConstants from 'constants/global';

const INITIAL_STATE = new Map({
    [GlobalConstants.PROP_FETCHING]: false,
    [ClaimsConstants.PROP_ISLOADED]: false,
  });
  
  const FilterReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case Actions.FETCH_FILTER_REQUEST:
        return state.set(GlobalConstants.PROP_FETCHING, true)

      case Actions.FETCH_FILTER_SUCCESS:
        let data = fromJS(action.filterData);
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, false)
          m.set(ClaimsConstants.PROP_FILTER_DATA, data)
        });

      case Actions.FETCH_FILTER_FAILURE:
        return state.withMutations(m => {
          m.set(GlobalConstants.PROP_FETCHING, false)
          m.set(ClaimsConstants.PROP_ERROR, action.error)
        });

      default:
        return state;
    }
  }
  
  export default FilterReducer; 


// import { Map, fromJS } from 'immutable';

// import * as Actions from './actions';
// import * as ClaimsConstants from 'constants/claims'; 
// import * as GlobalConstants from 'constants/global';

  
//   const FilterReducer = (state, action) => {
//     if (typeof state === 'undefined') {
//       return new Map().withMutations((m) => {
//         m.set(ClaimsConstants.PROP_FILTER_DATA, []);
//         m.set(ClaimsConstants.PROP_ISLOADED, false);
//       });
//     }
//     switch (action.type) {
//       case Actions.FETCH_FILTER_REQUEST:
//         return state.withMutations((m) => {
//           m.set(GlobalConstants.PROP_FETCHING, true);
//         });
//       case Actions.FETCH_FILTER_SUCCESS:
//         console.log('Filter actions', action)
//         let data = [...action.filterData];
//         return state.withMutations((m) => {
//           m.set(GlobalConstants.PROP_FETCHING, false);
//           m.set(ClaimsConstants.PROP_FILTER_DATA, data);
//         });
//       case Actions.FETCH_FILTER_FAILURE:
//         return state.withMutations((m) => {
//           m.set(GlobalConstants.PROP_FETCHING, false);
//           m.set(GlobalConstants.PROP_ERROR, action.error);
//         });
//       default:
//         return state;
//     }
//   }
  
//   export default FilterReducer; 