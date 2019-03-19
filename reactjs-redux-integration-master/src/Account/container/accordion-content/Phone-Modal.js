import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UISelectField from 'UI/UISelectField';
import UIInputField from 'UI/UIInputField';
import UICheckSelection from 'UI/UICheckSelection';

import { LAYOUTS } from 'UI/modules/Enumerations';
import { getPhoneNumberField } from 'modules/ConstraintHelper';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';

import * as PhoneConstants from 'constants/account';


@translate(['login', 'common'])
class PhoneModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {...props};
    return state;
  };

  handleSubmit = () => {
    const v = this.runValidations(this.state);

    if (v) {
      this.setState({
        error: v
      });
    } else {
      delete this.state.error;
      this.props.onExitModal();
    }
  };

  runValidations = (state) => {
    const {t} = this.props;
    let c = {};

    c[PhoneConstants.PROP_HOME] = getPhoneNumberField(t);
    c[PhoneConstants.PROP_MOBILE] = getPhoneNumberField(t);
    c[PhoneConstants.PROP_BUSINESS] = getPhoneNumberField(t);
    c[PhoneConstants.PROP_FAX] = getPhoneNumberField(t);
    
    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  render() {
    const { t } = this.props;
    let phoneNumberTypes = [
      {label: t('account:homePhoneNumber'), value: t('account:homePhoneNumber')},
      {label: t('account:mobilePhoneNumber'), value: t('account:mobilePhoneNumber')},
      {label: t('account:businessPhoneNumber'), value: t('account:businessPhoneNumber')}
    ]
    let donotCallText = [
      { label: t('account:dontCall') , value: "1" },
      { label: t('account:dontText') , value: "2" }
    ]
    return (
        <Fragment>
        <div className="row head">
          <div className="columns small-11 collapse-padding">
            <h2 className="hl-large">{t('account:changePhoneNumbers')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body top-1x modal-padding">
          <div className="columns small-12">
            <h3 className="hl-medium">{t('account:chooseDefaultContactNumber')}</h3>
          </div>
            <UISelectField
              label={t('account:defaultContactNumber')}
              name={PhoneConstants.PHONE_NUMBER_TYPES}
              choices={phoneNumberTypes}
              defaultValue={''}
              className="top-2x"
              layout={LAYOUTS.FLOAT12}
            />
            <UIInputField
              label={t('account:home')}
              name={PhoneConstants.PROP_HOME}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              className="top-1x"
              errorMessage={getErrorMessage(PhoneConstants.PROP_HOME, this.state.error)}
            />
            <UIInputField
              label={t('account:mobile')}
              name={PhoneConstants.PROP_MOBILE}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              errorMessage={getErrorMessage(PhoneConstants.PROP_MOBILE, this.state.error)}
            />
            <UIInputField
              label={t('account:business')}
              name={PhoneConstants.PROP_BUSINESS}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              errorMessage={getErrorMessage(PhoneConstants.PROP_BUSINESS, this.state.error)}
            />
            <UIInputField
              label={t('account:fax')}
              name={PhoneConstants.PROP_FAX}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              errorMessage={getErrorMessage(PhoneConstants.PROP_FAX, this.state.error)}
            />
          <div className="columns small-12 mlp-checkselection">
            <UICheckSelection
              name={PhoneConstants.DONT_CALL}
              layout={LAYOUTS.COLUMN0}
              onValidatedChange={this.update}
              choices={donotCallText}
              defaultValue={this.state[PhoneConstants.DONT_CALL ]}
            />
          </div>
        </div>
        <div className="row footer">
          <div className="columns small-6 text-center collapse-padding">
            <button className="secondary core2" onClick={this.props.onExitModal}>
              {t('account:close')}
            </button>
          </div>
          <div className="columns small-6 text-center collapse-padding">
            <button className="primary core2" onClick={this.handleSubmit}>
              {t('account:savechanges')}
            </button>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default PhoneModal;