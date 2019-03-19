import {fromJS } from 'immutable';

import * as IDCardActions from './actions';
import * as GlobalConstants from 'constants/global';

const defaultState = { 
  [GlobalConstants.PROP_INITIALIZED]: false, 
  [GlobalConstants.PROP_FETCHING]: false,
  [GlobalConstants.PROP_ERROR]: false,
};

const IDCardReducer = (state = fromJS(defaultState), action) => {

  switch (action.type) {
    case IDCardActions.ID_CARD_REQUEST_INIT:
      return state.set(GlobalConstants.PROP_INITIALIZED, false)
                  .set(GlobalConstants.PROP_FETCHING, true)
                  .set(GlobalConstants.PROP_ERROR, false);

    case IDCardActions.ID_CARD_REQUEST_SUCCESS:
      const {status, data} = action;
      return state.set(GlobalConstants.PROP_INITIALIZED, true)
                  .set(GlobalConstants.PROP_FETCHING, false)
                  .set(GlobalConstants.PROP_ERROR, false)
                  .set(GlobalConstants.PROP_STATUS, status)
                  .mergeDeep(data);

    case IDCardActions.ID_CARD_REQUEST_FAILURE:
      return state.set(GlobalConstants.PROP_INITIALIZED, false)
                  .set(GlobalConstants.PROP_FETCHING, false)
                  .set(GlobalConstants.PROP_ERROR, true)
                  .mergeDeep(action.data);

    default:
      return state;
  }
};

export default IDCardReducer;
