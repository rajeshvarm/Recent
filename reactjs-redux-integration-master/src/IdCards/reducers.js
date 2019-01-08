import {fromJS} from 'immutable';

import * as IDCardActions from './actions';

import * as GlobalConstants from 'constants/global';

const defaultState = {
  [GlobalConstants.PROP_INITIALIZED]: false,
  [GlobalConstants.PROP_FETCHING]: false,
  [GlobalConstants.PROP_ERROR]: false,
}

const IDCardReducer = (state = fromJS(defaultState), action) => {
  let serviceData = '';

  switch (action.type) {
    case IDCardActions.INIT_ID_CARD_REQUEST:
      serviceData = {
        ...defaultState,
        [GlobalConstants.PROP_FETCHING]: true
      };

      return fromJS(serviceData);

    case IDCardActions.ID_CARD_REQUEST_COMPLETE:
      const {status, data} = action;
      serviceData = {
        ...defaultState,
        [GlobalConstants.PROP_INITIALIZED]: true,
        status,
        ...data
      };
      console.log("IDcardServicedata",fromJS(serviceData))
      return fromJS(serviceData);

    case IDCardActions.ID_CARD_REQUEST_FAIL:
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

export default IDCardReducer;
