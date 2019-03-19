import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UICheckSelection from 'UI/UICheckSelection';

import { LAYOUTS } from 'UI/modules/Enumerations';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';


import * as DisabilityConstants from 'constants/account';


@translate(['login', 'common'])
class MobilityModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = { ...props };
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

    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  render() {
    const { t } = this.props;

    const disabilityChoices = [
      { label: t('account:deaf'), value: '1' },
      { label: t('account:blind'), value: '2' },
      { label: t('account:disabilityToFocus'), value: '3' },
      { label: t('account:difficultyWalking'), value: '4' },
      { label: t('account:difficultyDressing'), value: '5' },
      { label: t('account:disabilityAlone'), value: '6' },
      { label: t('account:disabilitySpeaking'), value: '7' }
    ];

    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 class="hl-large">{t('account:disability')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body mlp-right-checkselection">
          <UICheckSelection
            name={DisabilityConstants.DISABILITY_CHOICES}
            defaultValue={this.state[DisabilityConstants.DISABILITY_CHOICES]}
            layout={LAYOUTS.COLUMN0}
            onValidatedChange={this.update}
            choices={disabilityChoices}
          />
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

export default MobilityModal;