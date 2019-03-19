import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UIRadioSelection from 'UI/UIRadioSelection';

import { LAYOUTS } from 'UI/modules/Enumerations';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';


import * as AccessibilityConstants from 'constants/account';


@translate(['login', 'common'])
class AccessibilityModal extends Component {
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
    const {t} = this.props;
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

    const contrastChoices = [
      {label: t('account:lowContrast'), value: AccessibilityConstants.LOW_CONTRAST},
			{label: t('account:normalContrast'), value: 'normalContrast'},
			{label: t('account:preferNotToProvide'), value: 'highContrast'}
    ];

    const fontChoices = [
			{label: t('account:regularFont'), value: 'regularFont'},
			{label: t('account:largeFont'), value: 'largeFont'}
		];
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 class="hl-large">{t('account:accessibility')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body modal-padding">
          <h3 className="hl-medium">{t('account:contrast')}</h3>
          <div className='mlp-radio-buttons'>
          <UIRadioSelection
            layout={LAYOUTS.COLUMN0}
            required={true}
            label=""
            name={AccessibilityConstants.SELECT_CONTRAST}
            inline={false}
            defaultValue={this.state[AccessibilityConstants.SELECT_CONTRAST]}
            choices={contrastChoices}
            onValidatedChange={this.update}
            errorMessage={getErrorMessage(AccessibilityConstants.SELECT_CONTRAST, this.state.error)}
          />
          </div>
          <hr className="collapse"/>
          <h3 className="hl-medium">{t('account:fontSize')}</h3>
          <div className="mlp-radio-buttons ">
          <UIRadioSelection
            layout={LAYOUTS.COLUMN0}
            required={true}
            label=""
            name={AccessibilityConstants.SELECT_FONT_SIZE}
            inline={false}
            defaultValue={this.state[AccessibilityConstants.SELECT_FONT_SIZE]}
            choices={fontChoices}
            onValidatedChange={this.update}
            errorMessage={getErrorMessage(AccessibilityConstants.SELECT_FONT_SIZE, this.state.error)}
          />
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

export default AccessibilityModal;