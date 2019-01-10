import {fromJS, Map} from 'immutable';

import * as AccountDetailActions from 'actions/AccountDetail';

import * as GlobalConstants from 'constants/global';

const AccountDetailReducer = (state, action) => {
  // default initlization of the reducer.
  if (typeof state === 'undefined') {
    return new Map().withMutations((m) => {
      m.set(GlobalConstants.PROP_INITIALIZED, false);
      m.set(GlobalConstants.PROP_FETCHING, false);
      m.set(GlobalConstants.PROP_ERROR, false);
    });
  }
  switch (action.type) {
    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_REQUEST:
      return state.set(GlobalConstants.PROP_FETCHING, true);

    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_SUCCESS:
      const {status, data} = action;
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_INITIALIZED, true);
        m.set(GlobalConstants.PROP_FETCHING, false);
        m.set(GlobalConstants.PROP_STATUS, status);
        m.mergeDeep(data);
      });

    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_FAILURE:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_FETCHING, false);
        m.set(GlobalConstants.PROP_ERROR, true);
        m.mergeDeep(action.data);
      });

    default:
      return state;
  }
};

export default AccountDetailReducer;
