import {fromJS} from 'immutable';

import * as AccountDetailActions from './actions';

import * as GlobalConstants from 'constants/global';

const defaultState = {
  [GlobalConstants.PROP_INITIALIZED]: false,
  [GlobalConstants.PROP_FETCHING]: false,
  [GlobalConstants.PROP_ERROR]: false,
}

const AccountDetailReducer = (state = fromJS(defaultState), action) => {
  let serviceData = '';

  switch (action.type) {
    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_REQUEST:
      serviceData = {
        ...defaultState,
        [GlobalConstants.PROP_FETCHING]: true
      };

      return fromJS(serviceData);

    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_SUCCESS:
      const {status, data} = action;
      serviceData = {
        ...defaultState,
        [GlobalConstants.PROP_INITIALIZED]: true,
        status,
        ...data
      };
      console.log("serviceData",fromJS(serviceData))
      return fromJS(serviceData);

    case AccountDetailActions.FETCH_ACCOUNT_DETAIL_FAILURE:
      serviceData = {
        ...defaultState,
        [GlobalConstants.PROP_ERROR]: true,
        ...action.data
      };

      return fromJS(serviceData);

    default:
      return state;
  }
};

export default AccountDetailReducer;
