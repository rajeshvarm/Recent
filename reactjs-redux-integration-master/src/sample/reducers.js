import {Map, List, fromJS} from 'immutable';
import uid from 'uuid';
import * as WalletActions from 'actions/wallet';
import * as ApplicationActions from 'actions/application';
import * as GlobalConstants from 'constants/global';

function WalletReducer(state, action) {
  // default initlization of the reducer.
  if (typeof state === 'undefined') {
    return new Map().withMutations((m) => {
      m.set(GlobalConstants.PROP_INITIALIZED, false);
      m.set(GlobalConstants.PROP_FETCHING, false);
    });
  }

  switch (action.type) {
    case ApplicationActions.HYDRATION_REQUEST:
      console.log('WalletReducer HYDRATION_REQUEST', action.data.toJS());
      if (action.data.get(GlobalConstants.PROP_PAYMENT_METHOD_RESPONSE)) {
        return state.set(
          GlobalConstants.PROP_PAYMENT_METHOD,
          action.data.get(GlobalConstants.PROP_PAYMENT_METHOD_RESPONSE)
        );
      } else {
        return state;
      }
      // return state.mergeDeep(action.data);
      break;

    case WalletActions.REQUEST_INIT_WALLET:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_INITIALIZED, false);
        m.set(GlobalConstants.PROP_FETCHING, true);
      });
      break;

    case WalletActions.REQUEST_WALLET_COMPLETE:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_FETCHING, false);
        m.set(GlobalConstants.PROP_INITIALIZED, true);
        m.mergeDeep(action.data);
      });

    case WalletActions.REQUEST_WALLET_FAIL:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_FETCHING, false);
        m.set(GlobalConstants.PROP_INITIALIZED, false);
        m.set(GlobalConstants.PROP_ERROR, true);
      });
    
    case WalletActions.REQUEST_INIT_ADD_NEW_PAYMENT_METHOD:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_INITIALIZED, false);
        m.set(GlobalConstants.PROP_FETCHING, true);
      });

    case WalletActions.REQUEST_ADD_NEW_PAYMENT_METHOD_COMPLETE:
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_INITIALIZED, false);
        m.set(GlobalConstants.PROP_FETCHING, true);
      });
    
    case WalletActions.ADD_TO_WALLET_TEMP:
      const paymentMethods = state.get(GlobalConstants.PROP_PAYMENT_METHODS, fromJS([]));
      const updatedMethods = paymentMethods.push(fromJS(action.data));
      return state.withMutations((m) => {
        m.set(GlobalConstants.PROP_INITIALIZED, true);
        m.set(GlobalConstants.PROP_PAYMENT_METHODS, updatedMethods);
      });

    default:
      console.log('default wallet reducer');
      return state;
  }
}

export default WalletReducer;
