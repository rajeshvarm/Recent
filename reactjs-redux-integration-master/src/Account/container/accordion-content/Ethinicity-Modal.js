import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';

import UIRadioSelection from 'UI/UIRadioSelection';
import UICheckSelection from 'UI/UICheckSelection';
import UISelectField from 'UI/UISelectField';

import { LAYOUTS } from 'UI/modules/Enumerations';
import { getRequiredField } from 'modules/ConstraintHelper';
import { getErrorMessage } from 'modules/Utility';
import { confirmConstraints } from 'ui-utilities';

import * as EthnicityConstants from 'constants/account';


@translate(['login', 'common'])
class EthnicityModal extends Component {
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
		
		c[EthnicityConstants.SELECT_ETHNICITY] = getRequiredField(t);
		c[EthnicityConstants.BLACK_AFRICAN_AMERICAN] = getRequiredField(t);
    
    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    this.setState({
      [key]: value
    });
  }

  render() {
		const { t } = this.props;
		const ethnicityChoices = [
			{label: t('account:hispanicLatino'), value: 'hispanicLatino'},
			{label: t('account:nonHispanicLatino'), value: 'nonHispanicLatino'},
			{label: t('account:preferNotToProvide'), value: 'preferNotToProvide'}
		];
		const blackOrAfricanAmerican = [{label: t('account:blackOrAfricanAmerican'), value: 'yes'}];
		const race = [
			{label: t('account:nativeHawaiian'), value: '1'},
			{label: t('account:white'), value: '2'},
			{label: t('account:asian'), value: '3'},
			{label: t('account:nativeAmerican'), value: '4'},
			{label: t('account:otherRace'), value: '5'},
			{label: t('account:preferNotToProvide'), value: '6'}
		]
		const selectCountry = [{ label:t('account:selectCountry'), value:t('account:selectCountry')}]
    return (
        <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 class="hl-large">{t('account:ethnicity')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" className="close" onClick={this.props.onExitModal} />
          </div>
        </div>
        <div className="row body">
          <div className="columns small-12 medium-4 large-4">
            <h3 className="hl-medium">{t('account:selectEthnicity')}</h3>
            <p className="collapse">{t('account:selectOnlyOne')}</p>
						<div className="mlp-radio-buttons top-1x">
						<UIRadioSelection
							layout='COLUMN0'
							required={true}
							label=""
							name={EthnicityConstants.SELECT_ETHNICITY}
							inline={false}
							defaultValue={this.state[EthnicityConstants.SELECT_ETHNICITY]}
							choices={ethnicityChoices}
							onValidatedChange={this.update}
							errorMessage={getErrorMessage(EthnicityConstants.SELECT_ETHNICITY, this.state.error)}
						/>
						</div>
          </div>
          <div className="columns small-12 medium-8 large-8">
            <h3 className="hl-medium">{t('account:selectRace')}</h3>
						<p className="collapse">{t('account:selectUpToTwo')}</p>
						<div className="top-1x mlp-checkselection">
							<UICheckSelection
								name={EthnicityConstants.BLACK_AFRICAN_AMERICAN}
								defaultValue={this.state[EthnicityConstants.BLACK_AFRICAN_AMERICAN]}
								layout={LAYOUTS.COLUMN0}
								onValidatedChange={this.update}
								choices={blackOrAfricanAmerican}
							/>
							<UISelectField
								name={EthnicityConstants.SELECT_COUNTRY}
								choices={selectCountry}
								value={this.state[EthnicityConstants.SELECT_COUNTRY]}
								onValidatedChange={this.update}
								layout={LAYOUTS.COLUMN1}
								errorMessage={getErrorMessage(EthnicityConstants.SELECT_COUNTRY, this.state.error)}
							/>
							<UICheckSelection
								name={EthnicityConstants.PROP_RACE}
								defaultValue={this.state[EthnicityConstants.PROP_RACE]}
								layout={LAYOUTS.COLUMN0}
								onValidatedChange={this.update}
								choices={race}
							/>
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

export default EthnicityModal;