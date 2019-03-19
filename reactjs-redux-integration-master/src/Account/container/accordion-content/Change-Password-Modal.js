import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UIInputField from 'UI/UIInputField';
import UICheckSelection from 'UI/UICheckSelection';

import { LAYOUTS } from 'UI/modules/Enumerations';
import { getRequiredField, getComparePasswordsValidator } from 'modules/ConstraintHelper';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';

import * as PasswordConstants from 'constants/account';


@translate(['common','login'])
class PasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = { ...props };
    state[PasswordConstants.SHOW_CONFIRM_PW] = false;
    state[PasswordConstants.SHOW_PW] = false;
    state[PasswordConstants.IS_LENGTH_PASS] = false;
    state[PasswordConstants.IS_CHAR_PASS] = false;
    state[PasswordConstants.IS_UPPER_PASS] = false;
    state[PasswordConstants.IS_LOWER_PASS] = false;
    state[PasswordConstants.IS_NO_SPACE_PASS] = false;
    state[PasswordConstants.IS_NUM_PASS] = false;
    state[PasswordConstants.IS_SPECIAL_PASS] = false;
    
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
    const pw = state[PasswordConstants.PROP_PASSWORD];
    const confirmPW = state[PasswordConstants.PROP_CONFIRM_PASSWORD];
    let c = {};

    c[PasswordConstants.PROP_PASSWORD] = getRequiredField(t);
    c[PasswordConstants.PROP_CONFIRM_PASSWORD] = getComparePasswordsValidator(confirmPW, pw, t);

    return confirmConstraints(state, c);
  };

  onFlyValidator = () => {
    const currentPW = this.state[PasswordConstants.PROP_PASSWORD];

    const reqLength= /^.{6,15}$/;
    const reqChar = /^[a-zA-Z0-9.@$#\^_-]+$/;
    const reqUpperChar= /(?=.*[A-Z])/;
    const reqLowerChar= /(?=.*[a-z])/;
    const reqNoSpace= /^\S+$/;
    const reqNum= /^(?=.*[0-9])/;
    const reqSpecial= /[@#$._-]/;

    const passLength = reqLength.test(currentPW)
    const passChar = reqChar.test(currentPW || '')
    const passUpper = reqUpperChar.test(currentPW || '')
    const passLower = reqLowerChar.test(currentPW || '')
    const passNoSpace = reqNoSpace.test(currentPW || '')
    const passNum = reqNum.test(currentPW)
    const passSpecial = reqSpecial.test(currentPW)

    this.setState({
      [PasswordConstants.IS_LENGTH_PASS]: passLength,
      [PasswordConstants.IS_CHAR_PASS]: passChar,
      [PasswordConstants.IS_UPPER_PASS]: passUpper,
      [PasswordConstants.IS_LOWER_PASS]: passLower,
      [PasswordConstants.IS_NO_SPACE_PASS]: passNoSpace,
      [PasswordConstants.IS_NUM_PASS]: passNum,
      [PasswordConstants.IS_SPECIAL_PASS]: passSpecial
    })
  }

  update = (key, value) => {
    this.setState({
      [key]: value
    }, () => {this.onFlyValidator()});
  }

  toggleValue = key => {
    this.setState(prevState => {
      return {
        [key]: !prevState[key]
      }
    });
  }

  renderShowPasswordIcon = key => {
    const bool = this.state[key];

    return(
      <div className="columns small-3">
        <button className="naked collapse-padding password-icon" onClick={() => this.toggleValue(key)}>
          <span
            className={`icon icon-2x ${bool ? "icon-show-pswd" : "icon-hide-pswd"}`}
            aria-pressed={bool ? true : false}
            />
        </button>
      </div>
    );
  }

  renderPassOrFail = key => {
    let passOrFail = null;
    const bool = this.state[key];

    if(this.state[PasswordConstants.PROP_PASSWORD] !== undefined ) {
      passOrFail = (<span 
      className={`right-1x icon ${bool ? "icon-check positive" : "icon-close negative"}`}
      aria-label={bool ? "pass" : "fail"}
      />)
    }
    return passOrFail;
  }

  render() {
    const { t } = this.props;
    let communicationChoices = [{ label: t('account:futureCommunicationElectronically'), value: '1' }];

    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 class="hl-large">{t('account:changePassword')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body top-2x modal-padding">
        <div className="columns small-12 medium-5 large-5 collapse-padding">
          <div className="row">
            <UIInputField
              label={t('account:password')} 
              name={PasswordConstants.PROP_PASSWORD}
              defaultValue={this.state[PasswordConstants.PROP_PASSWORD]}
              maxLength={"15"}
              layout={LAYOUTS.FLOAT9}
              onValidatedChange={this.update}
              onChangeOverride={true}
              type={this.state[PasswordConstants.SHOW_PW] ? "text" : "password"}
              errorMessage={getErrorMessage(PasswordConstants.PROP_PASSWORD, this.state.error)}
              />
              {this.renderShowPasswordIcon(PasswordConstants.SHOW_PW)}
            <UIInputField
              label={t('account:confirmPassword')}
              name={PasswordConstants.PROP_CONFIRM_PASSWORD}
              defaultValue={this.state[PasswordConstants.PROP_CONFIRM_PASSWORD]}
              maxLength={"15"}
              layout={LAYOUTS.FLOAT9}
              onValidatedChange={this.update}
              onChangeOverride={true}
              type={this.state[PasswordConstants.SHOW_CONFIRM_PW] ? "text" : "password"}
              errorMessage={getErrorMessage(PasswordConstants.PROP_CONFIRM_PASSWORD, this.state.error)}
              />
              {this.renderShowPasswordIcon(PasswordConstants.SHOW_CONFIRM_PW)}
          </div>
          <div className="mlp-checkselection row">
            <div className="columns small-12 collapse">
              <UICheckSelection
                name={PasswordConstants.PROP_FUTURE_COMMUNICATIONS}
                layout={LAYOUTS.COLUMN0}
                onValidatedChange={this.update}
                defaultValue={this.state[PasswordConstants.PROP_FUTURE_COMMUNICATIONS ]}
                choices={communicationChoices}
              />
            </div>
          </div>
          <a href="#" className="icon padding-left-3x">
            <span aria-hidden="true" class="icon icon-1x icon-exclamation-circle" aria-hidden="true"></span>
            <span>{t('account:readMore')}</span>
          </a>
          </div>
          <div className="columns small-12 medium-7 large-7 top-1x">
            <div className="row border rounded password-guidelines padding-left-1x">
              <div className="columns">
                <h3 className="hl-medium">{t('account:passwordGuidelines')}</h3>
                <hr className="collapse"/>
                <h4 className="hl-tiny">{t('account:passwordExample')}</h4>
                <ul>
                  <li className="passLength">
                    {this.renderPassOrFail(PasswordConstants.IS_LENGTH_PASS)}
                    <span>{t('account:characterText')}</span>
                  </li>
                  <li className="passChar">
                    {this.renderPassOrFail(PasswordConstants.IS_CHAR_PASS)}
                    <span>{t('account:acceptableCharacter')}</span>
                  </li>
                  <li className="passUpper">
                    {this.renderPassOrFail(PasswordConstants.IS_UPPER_PASS)}
                    <span>{t('account:upperCase')}</span>
                  </li>
                  <li className="passLower">
                    {this.renderPassOrFail(PasswordConstants.IS_LOWER_PASS)}
                    <span>{t('account:lowerCase')}</span>
                  </li>
                  <li className="passNoSpace">
                    {this.renderPassOrFail(PasswordConstants.IS_NO_SPACE_PASS)}
                    <span>{t('account:emptySpaces')}</span>
                  </li>
                  <li className="passNum">
                    {this.renderPassOrFail(PasswordConstants.IS_NUM_PASS)}
                    <span>{t('account:oneNumber')}</span>
                  </li>
                  <li className="passSpecial">
                    {this.renderPassOrFail(PasswordConstants.IS_SPECIAL_PASS)}
                    <span>{t('account:oneSpecialCharacter')}</span>
                  </li>
                </ul>
            </div>
          </div>
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

export default PasswordModal;