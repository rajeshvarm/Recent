import React, {Fragment, Component} from 'react';
import {translate} from 'react-i18next';

import {LAYOUTS} from 'UI/modules/Enumerations';
import UIModal from 'UI/UIModal';
import UITabSwitcher from 'UI/UITabSwitcher';
import UIInputField from 'UI/UIInputField';
import UISelectField from 'UI/UISelectField';

import {getUSStatesSuffix} from 'modules/ChoicesHelper';
import {getRequiredField} from 'modules/ConstraintHelper';
import {
  getErrorMessage,
  confirmConstraints
} from 'modules/Utility';

import * as AccountConstants from 'constants/account';

@translate(['common', 'addressdetails'])
class AddressModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};

    return state;
  }

  handleSubmit = () => {
    const v = this.runValidations(this.state);

    if (v) {
      this.setState({
        error: v
      });
    } else {
      delete this.state.error;
    }
  };

  runValidations = (state) => {
    const {t} = this.props;
    let c = {};

    c[AccountConstants.ADDRESS_LINE_1] = getRequiredField(t);
    c[AccountConstants.ADDRESS_LINE_2] = getRequiredField(t);
    c[AccountConstants.CITY] = getRequiredField(t);
    c[AccountConstants.STATE] = getRequiredField(t);
    c[AccountConstants.ZIP_CODE] = getRequiredField(t);
    
    return confirmConstraints(state, c);
  };
  
  update = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  tabSelected = (choice) => {
    this.setState({
      'tabSelected': choice.name
    });
  }

  getTabIndex = (tabs, activeTab = 'Home') => {
    let index = 0;
    
    tabs.map((tab, inx) => {
      if(tab.name === activeTab) {
        index = inx;
      }
      return;
    });

    return index;
  }

  renderAddressFields = (t) => {
    return(
      <Fragment>
        <UIInputField 
          label={t('addressdetails:addressLine1')}
          name={AccountConstants.ADDRESS_LINE_1}
          defaultValue={''}
          layout={LAYOUTS.COLUMN4}
          onValidatedChange={this.update}
          errorMessage={getErrorMessage(AccountConstants.ADDRESS_LINE_1, this.state.error)} />

        <UIInputField 
          label={t('addressdetails:addressLine2')}
          name={AccountConstants.ADDRESS_LINE_2}
          defaultValue={''}
          layout={LAYOUTS.COLUMN4}
          onValidatedChange={this.update}
          errorMessage={getErrorMessage(AccountConstants.ADDRESS_LINE_2, this.state.error)} />

        <UIInputField 
          label={t('addressdetails:city')}
          name={AccountConstants.CITY}
          defaultValue={''}
          layout={LAYOUTS.COLUMN4}
          onValidatedChange={this.update}
          errorMessage={getErrorMessage(AccountConstants.CITY, this.state.error)} />

        <UISelectField 
          label={t('addressdetails:state')}
          name={AccountConstants.STATE}
          choices={getUSStatesSuffix(t)}
          defaultValue={''}
          layout={LAYOUTS.COLUMN4}
          onValidatedChange={this.onValidatedChange}
          errorMessage={getErrorMessage(AccountConstants.STATE, this.state.error)} />

        <UIInputField 
          label={t('addressdetails:zipCode')}
          name={AccountConstants.ZIP_CODE}
          defaultValue={''}
          layout={LAYOUTS.COLUMN4}
          onValidatedChange={this.onValidatedChange}
          errorMessage={getErrorMessage(AccountConstants.ZIP_CODE, this.state.error)} />
      </Fragment>
    );
  }

  renderAddressForm = (t) => {
    const addressTypes = [
      {
        name: t('addressdetails:home'),
        children: this.renderAddressFields(t)
      },
      {
        name: t('addressdetails:billing'),
        children: this.renderAddressFields(t)
      },
      {
        name: t('addressdetails:alternate'),
        children: this.renderAddressFields(t)
      }
    ];
    
    return <UITabSwitcher
      choices={addressTypes}
      activeIndex={this.getTabIndex(addressTypes, this.props.defaultValue)}
      className="text-center"
      name={this.props.name}
      onClick={this.tabSelected} />;
  }

  renderAddressModal = (t) => {
    const props = this.props;
    return(
      <UIModal visible={props.visible} onExit={props.onExit}>
        <div className="row head">
          <div className="columns small-11 padding-2x padding-bottom-2x">
            <h2 id="modal-title" className="hl-large">
              {t('addressdetails:modalTitle')}
            </h2>
          </div>
          <div className="columns small-1">
            <button type="button" aria-label="close-dialog" title="close-dialog" onClick={props.onExit}>
              <span aria-hidden="true" class="icon icon-2x icon-remove padding-right-2x" />
            </button>
          </div>
        </div>
        <div className="body">
          {this.renderAddressForm(t)}
        </div>
        <div className="row footer">
          <div className="columns large-6 medium-6">
            <button className="secondary" onClick={props.onExit}>
              {t('button.close')}
            </button>
          </div>
          <div className="columns large-6 medium-6 text-right">
            <button className="primary" onClick={this.handleSubmit}>{t('button.saveChanges')}</button>
          </div>
        </div>
      </UIModal>
    );
  }

  render() {
    const {t} = this.props;
    return(
      <Fragment>
        {this.renderAddressModal(t)}
      </Fragment>
    );
  }
}

export default AddressModal;
