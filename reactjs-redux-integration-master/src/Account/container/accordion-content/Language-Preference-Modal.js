import React, { Component, Fragment } from "react";
import { translate } from "react-i18next";

import UIRadioSelection from "UI/UIRadioSelection";
import UISelectField from "UI/UISelectField";

import { getPreferredSpokenLanguageSuffix, getPreferredWrittenLanguageSuffix } from 'modules/ChoicesHelper';
import { LAYOUTS } from "UI/modules/Enumerations";
import { getRequiredField } from "modules/ConstraintHelper";
import { getErrorMessage } from "modules/Utility";
import { confirmConstraints } from 'ui-utilities';

import * as LanguageConstants from "constants/account";

@translate(["login", "common"])
class LanguagePreferenceModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = props => {
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

  runValidations = state => {
    const { t } = this.props;
    let c = {};

    c[LanguageConstants.WELL_SPEAK_ENGLISH] = getRequiredField(t);

    return confirmConstraints(state, c);
  };

  update = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  render() {
    const { t } = this.props;
    const languageProficiencyChoices = [
      { label: t("account:veryWell"), value: "veryWell" },
      { label: t("account:well"), value: "well" },
      { label: t("account:notWell"), value: "notWell" },
      { label: t("account:notAtAll"), value: "notAtAll" },
      { label: t("account:preferNotToProvide"), value: "preferNotToProvide" }
    ];

    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 className="hl-large">{t("account:language")}</h2>
          </div>
          <div className="columns small-1">
            <button
              aria-label="close-dialog"
              title="close-dialog"
              className="close"
              onClick={this.props.onExitModal}
            />
          </div>
        </div>
        <div className="row body">
          <div className="columns small-12 medium-6 large-6">
            <h3 className="hl-medium">{t("account:spokenLanguagePreference")}</h3>
            <div className="row">
              <UISelectField
                name={LanguageConstants.SPOKEN_LANGUAGE}
                label={t("account:selectLanguage")}
                choices={getPreferredSpokenLanguageSuffix(t)}
                value={this.state[LanguageConstants.SPOKEN_LANGUAGE]}
                onValidatedChange={this.update}
                layout={LAYOUTS.FLOAT10}
                errorMessage={t(
                  getErrorMessage(
                    LanguageConstants.SPOKEN_LANGUAGE,
                    this.state.error
                  )
                )}
              />
            </div>
            <h3 className="hl-medium">{t("account:writtenLanguagePreference")}</h3>
            <div className="row">
              <UISelectField
                name={LanguageConstants.WRITTEN_LANGUAGE}
                label={t("account:selectLanguage")}
                choices={getPreferredWrittenLanguageSuffix(t)}
                value={this.state[LanguageConstants.WRITTEN_LANGUAGE]}
                onValidatedChange={this.update}
                layout={LAYOUTS.FLOAT10}
                errorMessage={t(
                  getErrorMessage(
                    LanguageConstants.WRITTEN_LANGUAGE,
                    this.state.error
                  )
                )}
              />
            </div>
            <div className="columns small-12 collapse-padding top-1x">
              <p>{t("account:languageNote")}</p>
            </div>
          </div>
          <div className="columns small-12 medium-6 large-6">
            <h3 className="hl-medium">{t("account:howWellDoYouSpeakEnglish")}</h3>
            <div className="mlp-radio-buttons">
              <UIRadioSelection
                layout={LAYOUTS.COLUMN0}
                required={true}
                label=""
                name={LanguageConstants.WELL_SPEAK_ENGLISH}
                inline={false}
                defaultValue={this.state[LanguageConstants.WELL_SPEAK_ENGLISH]}
                choices={languageProficiencyChoices}
                onValidatedChange={this.update}
                errorMessage={t(
                  getErrorMessage(
                    LanguageConstants.WELL_SPEAK_ENGLISH,
                    this.state.error
                  )
                )}
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
    );
  }
}

export default LanguagePreferenceModal;
