import React, { Component, Fragment } from 'react';
import UIInputField from 'UI/UIInputField';
import UICheckSelection from 'UI/UICheckSelection';
import { LAYOUTS } from 'UI/modules/Enumerations';
import { getRequiredEmailAddress } from 'modules/ConstraintHelper';
import { translate } from 'react-i18next';

import * as EmailConstants from 'constants/account';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';

@translate(['account', 'common'])
class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {...props};
    state[EmailConstants.PROP_EMAIL] = '';

    return state;
  };

  handleSubmit = () => {
    const v = this.runValidations(this.state);
    if (v) {
      this.setState({ error: v });
    } else {
      //Success! Validation passed.
      //clean state and delete the empty error object if present
      delete this.state.error;
      this.props.onExitModal();
    }
  };

  runValidations = (state) => {
    const { t } = this.props;
    let c = {};

    c[EmailConstants.PROP_EMAIL] = getRequiredEmailAddress(t);

    return confirmConstraints(state, c);    
  };

  update = (key, value) => {
    this.setState(...this.state, {
      [key]: value
    });
  }

  render() {
    const { t } = this.props;
    let donotSendMeEmails = [{ label: t('account:dontSendEmails'), value: '1' }];
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11 collapse-padding">
            <h2 class="hl-large">{t('account:changeEmail')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body top-1x modal-padding">
          <div className="columns small-12">
            <h3 className="hl-medium">{t('account:emailaddressonfile')}</h3>
          </div>
          <div className="columns small-12">
            {this.props.data.getIn(['memberView', 'Email'])}
          </div>
            <UIInputField
              label={t('account:enteremailaddress')}
              name={EmailConstants.PROP_EMAIL}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              className="top-2x"
              errorMessage={getErrorMessage(EmailConstants.PROP_EMAIL, this.state.error)}
            />
            <UIInputField
              label={t('account:reenteremailaddress')}
              name={EmailConstants.PROP_EMAIL}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT12}
              errorMessage={getErrorMessage(EmailConstants.PROP_EMAIL, this.state.error)}
            />
          <div className="collapse-padding mlp-checkselection">
            <UICheckSelection
              name={EmailConstants.DONT_SEND_EMAILS}
              layout={LAYOUTS.COLUMN0}
              onValidatedChange={this.update}
              defaultValue={this.state[EmailConstants.DONT_SEND_EMAILS ]}
              choices={donotSendMeEmails}
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

export default EmailModal;