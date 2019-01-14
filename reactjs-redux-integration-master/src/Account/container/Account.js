import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { translate } from "react-i18next";
import { fromJS } from 'immutable';
import * as links from "constants/routes";

import UIInputField from 'UI/UIInputField';
import { LAYOUTS } from 'UI/modules/Enumerations';
import { getRequiredEmailAddress } from 'modules/ConstraintHelper';
import { confirmConstraints } from 'ui-utilities';
import * as LoginConstants from 'constants/login';
import * as EmailConstants from 'constants/account';



import { numberWithoutDecimalFormat } from 'modules/Utility';
import AddPaymentMethod from 'components/add-payment-method/containers/AddPaymentMethod';
import UIModal from "UI/UIModal";
import UIAccordion from "UI/UIAccordion";
import UIRadioSelection from "UI/UIRadioSelection";
import UICheckSelection from "UI/UICheckSelection";

import * as AccountDetailActions from 'actions/AccountDetail';

@translate(["common", "account"])
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  /// @@@@@@ TRANSFORMATION ........................

  ingressDataTransform = props => {
    // responsible for transforming any incomming data into usable state for the container.
    let state = {};
    state["modalVisibility"] = false;
    state["isMegaButton"] = true;
    state["passwordConfirmation"] = false;
    state[LoginConstants.PROP_USER_NAME] = '';


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
    }
  };

  getErrorMessage = (field, errors) => {
    // interagates the errors object for related messages.
    if (errors) {
      let messages = [];
      if (Array.isArray(field)) {
        field.map(function (v, index) {
          if (errors.hasOwnProperty(v)) {
            messages.push(errors[v].join());
          }
        });
      } else {
        if (errors.hasOwnProperty(field)) {
          messages.push(errors[field].join());
        }
      }
      return messages.join();
    }
  }

  runValidations = (state) => {
    const { t } = this.props;
    let constraints = {};

      constraints[LoginConstants.PROP_USER_NAME] = getRequiredField(t);
    
      return confirmConstraints(state, constraints);
  };

  update = (key, value) => {
    this.setState(...this.state, {
      [key]: value
    });
  }

  componentDidMount() {
    this.props.dispatch(AccountDetailActions.fetchAccountDetails());
  }

  toggleDialogVisibility = (component) => {
    this.setState((prevState) => {
      return {
        modalVisibility: !prevState.modalVisibility,
        modalComponent: component ? component : ''
      }
    })
  };

  //Left-Section of Account
  renderProfileDiv = () => {
    const { t } = this.props;
    console.log("account", this.props)
    let list = this.props.data.getIn(['memberView'], fromJS([]));
    let progress = this.props.data.get('profileOptimization');
    return (
      <div className="account">
        <div className="border-image">
          <img src="images/circular-image-treatment.jpg" />
        </div>
        <button className="image-icon hide-for-small-only">
          <span aria-hidden="true" class="icon icon-1x icon-pencil"></span>
        </button>
        <div class="top-5x">
          <h2 class="hl-medium">{list.get('MemberFirstName')} {list.get('MemberLastName')}</h2>
          <MediaQuery maxDeviceWidth={640}>
            <div className="row button-margin">
              <div className="columns small-12">
                <button className="primary core2 expand">
                  {t('account:uploadPhoto')}
                </button>
              </div>
              <div className="columns small-12">
                <button className="secondary core2 expand">
                  {t('account:removoPhoto')}
                </button>
              </div>
            </div>
          </MediaQuery>
          <div class="progress-bar" role="progressbar" tabIndex="0" aria-valuenow={progress} aria-valuemin="0"
            aria-valuetext={`${progress} percent`}
            aria-valuemax="100">
            <div class="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p><span className="font">{numberWithoutDecimalFormat(progress)}</span> / 100</p>
          <hr className="collapse" />
          <p className="hide-for-small-only"><strong>{t("account:accountcomplete")}</strong></p>
          <hr className="collapse hide-for-small-only" />
          <p><a href="#" className="font">{t("account:emergencycontact")}</a></p>
          <p><a href="#" className="font">{t("account:verifyemail")}</a></p>
        </div>
      </div>
    );
  };

  //Rendering Inside Accordion Body
  renderAccordionContentRow = (list) => {
    const { t } = this.props;
    return (
      <MediaQuery minDeviceWidth={640}>
        {(matches) => {
          if (matches) {
            return (
              <Fragment>
                <div className="row dotted-divider">
                  <div className="columns small-12 medium-4 large-4 top-1x">
                    <strong>{list.label}</strong>
                  </div>
                  <div className="columns small-12 medium-7 large-4 top-1x">
                    {list.value}
                  </div>
                  <div className="columns small-12 medium-1 large-1 bottom-1x">
                    {list.isEdit && <button className="image-icon-text" onClick={this.toggleDialogVisibility.bind(this, list.uiModalComponent)} aria-haspopup="dialog">
                      <span aria-hidden="true" class="icon icon-1x icon-pencil" />
                      <div>{t("button.edit")}</div>
                    </button>}
                  </div>
                </div>
              </Fragment>
            );
          }
          else {
            return (
              <div className="row dotted-divider">
                <div className="columns small-10">
                  <div className="row">
                    <div className="columns small-12">
                      <strong>{list.label}</strong>
                    </div>
                    <div className="columns small-12">
                      {list.value}
                    </div>
                  </div>
                </div>
                <div className="columns small-2">
                  {list.isEdit && <button className="image-icon-text" onClick={this.toggleDialogVisibility.bind(this, list.uiModalComponent)} aria-haspopup="dialog">
                    <span aria-hidden="true" class="icon icon-1x icon-pencil" />
                    <div>{t("button.edit")}</div>
                  </button>}
                </div>
              </div>
            );
          }
        }}
      </MediaQuery>
    )
  }

  // Address types
  appendAddressDetails = (list) => {
    let address = '';
    list.mapKeys((key, value) => {
      value = value && key !== 'type' ? value : '';
      address = `${address} ${value}`;
    });
    return address;
  }

  renderAddressTypes = () => {
    const {t} = this.props
    let list = this.props.data;
    let addressLabel = [t('account:homeAddress'), t('account:alternateAddress'), t('account:billingAddress')];
    let listData = [];
    for (let i = 0; i < list.getIn(['memberView', 'address']).size; i++) {
      listData.push({
        label: addressLabel[i],
        value: this.appendAddressDetails(list.getIn(['memberView', 'address', i])),
        isEdit: true,
        data: list.getIn(['memberView', 'address']),
        uiModalComponent: this.renderEditAddressModal(list.getIn(['memberView', 'address'])),
        key: `renderAddressTypes-${i}`
      });
    }
    return listData.map((listData) => this.renderAccordionContentRow(listData))
  }

  renderEditAddressModal = () => {
    const { t } = this.props
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 id="modal-title" className="left-3x">{t('account:changeAddress')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" onClick={this.toggleDialogVisibility} />
          </div>
        </div>
        <div className="row body">
        </div>
        <div className="row footer">
          <div className="columns small-6">
            <button className="button primary core2 columns small-12 large-6" onClick={this.toggleDialogVisibility}>
              {t('account:close')}
            </button>
          </div>
          <div className="columns small-6">
            <button className="button secondary core2 columns small-12 large-6 float-right" onClick={this.toggleDialogVisibility}>
              {t('account:savechanges')}
            </button>
          </div>
        </div>
      </Fragment>
    )
  }

  //Email
  renderEmailValue = () => {
    const {t} = this.props
    return (
      <Fragment>
        <span>{this.props.data.getIn(['memberView', 'Email'])}</span>
        <span className="left-2x">
          {
            this.props.data.getIn(['memberView', 'isEmailVerified']) ? <span className="green">{t('account:verified')}</span> :
            <a>{t('account:unverified')}</a>
          }
        </span>
      </Fragment>
    )
  }

  renderEmailAddress = () => {
    const {t} =this.props
    let email = this.props.data.getIn(['memberView', 'Email']);
    let emailList = {
      label: t('account:email'),
      value: this.renderEmailValue(),
      isEdit: true,
      data: email,
      uiModalComponent: this.renderEmailModal(email),
      key: 'renderEmailAddress'
    }
    return this.renderAccordionContentRow(emailList)
  }

  renderEmailModal = (email) => {
    const { t } = this.props
    const donotSendMeEmails = [{label: t('account:pleasedonotsendmeemails'), value: '1'}];
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 id="modal-title">{t('account:changeEmail')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" onClick={this.toggleDialogVisibility} />
          </div>
        </div>
        <div className="row body top-1x">
          <div className="columns small-12">
            <strong>{t('account:emailaddressonfile')}</strong>
          </div>
          <div className="columns small-12">
            {this.props.data.getIn(['memberView', 'Email'])}
          </div>
          <div className="columns small-12 top-1x">
            <UIInputField
              label={t('account:enteremailaddress')}
              name={LoginConstants.PROP_USER_NAME}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={this.getErrorMessage(LoginConstants.PROP_USER_NAME, this.state.error)}
            />
          </div>
          <div className="columns small-12">
            <UIInputField
              label={t('account:reenteremailaddress')}
              name={LoginConstants.PROP_USER_NAME}
              onValidatedChange={this.update}
              layout={LAYOUTS.FLOAT6}
              errorMessage={this.getErrorMessage(LoginConstants.PROP_USER_NAME, this.state.error)}
            />
          </div>
          <div className="columns small-12 top-1x">
            <UICheckSelection
              name={EmailConstants.PLEASE_DO_NOT_SEND_ME_EMAILS}
              layout={LAYOUTS.COLUMN0}
              onValidatedChange={this.update}
              defaultValue={this.state.donotSendMeEmails}
              choices={donotSendMeEmails}
            />
          </div>
        </div>
        <div className="row footer">
          <div className="columns small-6">
            <button className="button primary core2 columns small-12 large-6" onClick={this.toggleDialogVisibility}>
              {t('account:close')}
            </button>
          </div>
          <div className="columns small-6">
            <button className="button secondary core2 columns small-12 large-6 float-right" onClick={this.handleSubmit}>
              {t('account:savechanges')}
            </button>
          </div>
        </div>
      </Fragment>
    )
  }

  //Phone
  renderEditPhoneNumberModal = () => {
    const { t } = this.props
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11">
            <h2 id="modal-title" className="left-3x">{t('account:changePhoneNumber')}</h2>
          </div>
          <div className="columns small-1">
            <button aria-label="close-dialog" title="close-dialog" onClick={this.toggleDialogVisibility} />
          </div>
        </div>
        <div className="row body">
        </div>
        <div className="row footer">
          <div className="columns small-6">
            <button className="button primary core2 columns small-12 large-6" onClick={this.toggleDialogVisibility}>
              {t('account:close')}
            </button>
          </div>
          <div className="columns small-6">
            <button className="button secondary core2 columns small-12 large-6 float-right" onClick={this.toggleDialogVisibility}>
              {t('account:savechanges')}
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  renderMobileNumber = () => {
    const {t} = this.props
    let contactDetails = [
      { label: t('account:phone'), suffix: 'M:', key: 'MobileNum', labelHide: false, verifcationKey: 'isPhoneNumMobVerified' },
      // {label: 'Home', suffix: 'H', key: 'PhoneNum',  labelHide: true, verifcationKey: 'isPhoneNumHomeVerified'},
      // {label: 'Buisness', suffix: 'B', key: 'BusinessPhNum',  labelHide: true, verifcationKey: 'isPhoneNumBusiVerified'}
    ]
    let mobileList = [];
    contactDetails.forEach((list, index) => {
      mobileList.push({
        label: !list.labelHide ? list.label : '',
        value: this.renderMobileValue(list),
        isEdit: index === 0 ? true : false,
        data: this.props.data.getIn(['memberView', list.key]),
        uiModalComponent: this.renderEditPhoneNumberModal(this.props.data.getIn(['memberView', list.key]), list),
        key: `renderEmailAddress-${index}`
      })

    });
    return mobileList.map((list) => this.renderAccordionContentRow(list))
  }

  renderMobileValue = (list) => {
    const {t} = this.props
    return (
      <Fragment key={list.key}>
        <span>{list.suffix} {this.props.data.getIn(['memberView', list.key])}</span>
        <span className="left-2x">
          {
            this.props.data.getIn(['memberView', list.verifcationKey]) ? <span className="green">{t('account:verified')}</span> :
              <a className="verification_link">{t('account:unverified')}</a>
          }
        </span>
      </Fragment>
    )
  }

  //Addresses,Email and Phone Numbers body
  renderAddressEmailAndPhone = (t) => {
    let list = this.props.data;
    let listData = {}
    return (
      <div>
        {list.getIn(['memberView', 'address']) && this.renderAddressTypes()}
        {list.getIn(['memberView', 'Email']) && this.renderEmailAddress()}
        {list.getIn(['memberView', 'MobileNum']) && this.renderMobileNumber()}
      </div>
    );
  };

  renderEthnicityLanguagePreference = (t) => {
    return (
      <div>
      </div>
    );
  };

  renderAccessibilityMobilityTransportation = (t) => {
    return (
      <div>
      </div>
    );
  };

  renderAccountManagement = (t) => {
    return (
      <div>
      </div>
    );
  };

  renderPaymentMethods = (t) => {
    return (
      <div>
        <AddPaymentMethod />
      </div>
    );
  };

  renderEmergencyContact = (t) => {
    return (
      <div>
      </div>
    );
  };

  renderLegalSettings = (t) => {
    return (
      <div>
      </div>
    );
  };

 //Right-Section of Account
  renderProfileDetail = () => {
    const { t } = this.props;
    const accordionContent = [
      {
        araiLabel: t('account:accordionHeaders.addressEmailAndPhone'),
        header: t('account:accordionHeaders.addressEmailAndPhone'),
        body: this.renderAddressEmailAndPhone(t)
      },
      {
        araiLabel: t('account:accordionHeaders.ethnicityLanguagePreference'),
        header: t('account:accordionHeaders.ethnicityLanguagePreference'),
        body: this.renderEthnicityLanguagePreference(t)
      },
      {
        araiLabel: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        header: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        body: this.renderAccessibilityMobilityTransportation(t)
      },
      {
        araiLabel: t('account:accordionHeaders.accountManagement'),
        header: t('account:accordionHeaders.accountManagement'),
        body: this.renderAccountManagement(t)
      },
      {
        araiLabel: t('account:accordionHeaders.paymentMethods'),
        header: t('account:accordionHeaders.paymentMethods'),
        body: this.renderPaymentMethods(t)
      },
      {
        araiLabel: t('account:accordionHeaders.emergencyContact'),
        header: t('account:accordionHeaders.emergencyContact'),
        body: this.renderEmergencyContact(t)
      },
      {
        araiLabel: t('account:accordionHeaders.legalSettings'),
        header: t('account:accordionHeaders.legalSettings'),
        body: this.renderLegalSettings(t)
      }
    ];
    return (
      <div>
        <UIAccordion
          className="accordion-naked"
        >
          {accordionContent}
        </UIAccordion>
        <UIModal visible={this.state.modalVisibility} onExit={this.toggleDialogVisibility}>
          {this.state.modalComponent}
        </UIModal>
      </div>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <div className="row">
          <div className="columns small-12">
            <h1>{t("account:account")}</h1>
          </div>
        </div>
        <div className="rows top-4x">
          <div className="columns small-12 medium-4 large-4 bottom-2x">
            {this.renderProfileDiv()}
          </div>
          <div className="columns small-12 medium-8 large-8">
            {this.renderProfileDetail()}
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.AccountDetailReducer
  };
}

export default connect(mapStateToProps)(Account);
