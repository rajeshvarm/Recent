import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UIInputField from 'UI/UIInputField';
import UISelectField from 'UI/UISelectField';
import UIAccordion from 'UI/UIAccordion';

import { getUSStatesSuffix } from 'modules/ChoicesHelper';
import { LAYOUTS } from 'UI/modules/Enumerations';
import { getRequiredField } from 'modules/ConstraintHelper';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';

import * as EmergencyContactConstants from 'constants/account';


@translate(['common', 'account', 'addressdetails'])
class EmergencyContactModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};
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
    const { t } = this.props;
    let c = {};

    c[EmergencyContactConstants.EMERGENCY_FIRST_NAME] = getRequiredField(t);
    c[EmergencyContactConstants.EMERGENCY_LAST_NAME] = getRequiredField(t);
    c[EmergencyContactConstants.EMERGENCY_PHONE_NUMBER] = getRequiredField(t);
    c[EmergencyContactConstants.EMERGENCY_RELATIONSHIP] = getRequiredField(t);


    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  renderOptionalFieldsContent = () => {
    const {t} = this.props
    return(
      <div className="modal-padding">
        <div className="row">
          <UIInputField
            label={t('addressdetails:addressLine1')}
            name={EmergencyContactConstants.ADDRESS_LINE_1}
            defaultValue={''}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
          <UIInputField
            label={t('addressdetails:addressLine2')}
            name={EmergencyContactConstants.ADDRESS_LINE_2}
            defaultValue={''}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
        </div>
        <div className="row">
          <UIInputField
            label={t('addressdetails:city')}
            name={EmergencyContactConstants.CITY}
            defaultValue={''}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
          <UISelectField
            label={t('addressdetails:state')}
            name={EmergencyContactConstants.STATE}
            choices={getUSStatesSuffix(t)}
            defaultValue={''}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
        </div>
        <div className="row">
          <UIInputField
            label={t('account:alternatePhone')}
            name={EmergencyContactConstants.EMERGENCY_ALTERNATE_PHONE}
            defaultValue={''}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
          <UIInputField
            label={t('account:email')}
            name={EmergencyContactConstants.PROP_EMAIL}
            onValidatedChange={this.update}
            layout={LAYOUTS.FLOAT6}
            onValidatedChange={this.update}
          />
        </div>
      </div>
    )
  }

  renderOptionalFields = (t) => {
    const accordionContent = [{
      "aria-label": t('account:optionalFields'),
      "header": t('account:optionalFields'),
      "body": this.renderOptionalFieldsContent(t)
    }]
    return (
      <UIAccordion>
        {accordionContent}
      </UIAccordion>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 class="hl-large">{t('account:addEmergencyContact')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body collapse">
        <div className="modal-padding top-1x">
          <div className="columns small-12 standard panel border">
            <div className="row">
              <div className="columns small-3 medium-1 large-1">
                <span className="icon-care-team icon circle"></span>
              </div>
              <div className="columns small-9 medium-11 large-11">
                <h3 className="collapse hl-medium">{t("account:myCareTeam")}</h3>
                <p>{t("account:myCareTeamContent")}</p>
                <a href="#/links">{t("account:viewMyCareTeam")}</a>
              </div>
            </div>
          </div>
          <div className="columns small-12">
            <div className="row">
            <UIInputField
              label={t('common:name.first')}
              name={EmergencyContactConstants.EMERGENCY_FIRST_NAME}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={getErrorMessage(EmergencyContactConstants.EMERGENCY_FIRST_NAME, this.state.error)}
            />
            <UIInputField
              label={t('common:name.last')}
              name={EmergencyContactConstants.EMERGENCY_LAST_NAME}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={getErrorMessage(EmergencyContactConstants.EMERGENCY_LAST_NAME, this.state.error)}
            />
            </div>
            <div className="row">
            <UIInputField
              label={t('account:phoneNumber')}
              name={EmergencyContactConstants.EMERGENCY_PHONE_NUMBER}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={getErrorMessage(EmergencyContactConstants.EMERGENCY_PHONE_NUMBER, this.state.error)}
            />
            <UIInputField
              label={t('account:relationship')}
              name={EmergencyContactConstants.EMERGENCY_RELATIONSHIP}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={getErrorMessage(EmergencyContactConstants.EMERGENCY_RELATIONSHIP, this.state.error)}
            />
            </div>
          </div>
          </div>
          <div className="columns small-12 optionalfields">
          {this.renderOptionalFields(t)}
          </div>
        </div>
        <div className="row footer">
          <div className="columns small-6 medium-3 large-3">
            <button className="secondary core2 expand" onClick={this.props.onExitModal}>
              {t('account:close')}
            </button>
          </div>
          <div className="columns small-6 medium-3 large-3 medium-offset-6 large-offset-6 text-right">
            <button className="primary core2 expand" onClick={this.handleSubmit}>
              {t('account:savechanges')}
            </button>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default EmergencyContactModal;