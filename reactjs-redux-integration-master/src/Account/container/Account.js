import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";
import MediaQuery from 'react-responsive';
import {translate} from 'react-i18next';
import {fromJS} from 'immutable';
import Dropzone from "react-dropzone";

import * as links from "constants/routes";
import UIModal from 'UI/UIModal';
import UIAccordion from 'UI/UIAccordion';
import {numberWithoutDecimalFormat, phoneNumberFormat} from 'modules/Utility';

import * as AccountConstants from 'constants/account';
import * as GlobalConstants from 'constants/global';
import * as AccountDetailActions from 'actions/accountDetail';
import * as ProfileImageActions from 'actions/profileImage';

import AddressModal from 'components/AddressModal';
import AccordionContentRow from 'components/AccordionContentRow';
import EmailModal from './accordion-content/Email-Modal';
import PhoneModal from './accordion-content/Phone-Modal';
import EthnicityModal from './accordion-content/Ethnicity-Modal';
import LanguagePreferenceModal from './accordion-content/Language-Preference-Modal';
import AccessibilityModal from './accordion-content/Accessibility-Modal';
import MobilityModal from './accordion-content/Mobility-Modal';
import DisabilityModal from './accordion-content/Disability-Modal';
import TransportationModal from './accordion-content/Transportation-Modal';
import PasswordModal from './accordion-content/Change-Password-Modal';
import EmergencyContactModal from './accordion-content/Emergency-Contact';
import Loader from 'components/Loader';


@translate(['common', 'account', 'addressdetails'])
class Account extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    let state = {};
    state['modalVisibility'] = false;
    state['isMegaButton'] = true;
    state['addressVisible']= false;

    return state;
  };

  componentDidMount() {
    this.props.dispatch(AccountDetailActions.fetchAccountDetails());
  }

  toggleDialogVisibility = (component, modalClass) => {
    this.setState((prevState) => {
      console.log('modalClass', modalClass)
      return {
        modalVisibility: !prevState.modalVisibility,
        modalComponent: component ? component : '',
        modalClass: modalClass ? modalClass : ''
      };
    });
  };

  handleUpload = file => {
    console.log("Uploaded New file", file);
    this.props.dispatch(ProfileImageActions.uploadProfileImg(file));
    return;
  };

  //Left-Section of Account
  renderProfileImage = (t) => {
    const { profileImgReducer } = this.props;
    const profileImg = profileImgReducer && profileImgReducer.get(GlobalConstants.PROP_PROFILE_IMG);

    let img = (
    <div className="border-image">
      <div id="profileImage" class="icon icon-4x icon-user core1" />
    </div>)
    let removeButton = null;

    if(profileImg){
      img = (
        <Loader isFetching={profileImgReducer && profileImgReducer.get(GlobalConstants.PROP_FETCHING)} containerClass="border-image">
          <div className="border-image">
            <img id="profileImage" src={`data:image/png;base64,${profileImg}`} alt="" />
          </div>
        </Loader>
      )
      removeButton = (
        <div className="columns small-12">
          <button className="secondary core2 mlp-button expand-75">{t('account:removoPhoto')}</button>
        </div>
      )
    }

    return (
      <section className="standard panel text-center" aria-label={t('account:photo')}>
        <div className="row">
          <div className="columns small-12 bottom-3x">
            {img}
          </div>
          {removeButton}
          <div className="columns small-12">
            <Dropzone
              className={`profile-image-uploader`}
              onDrop={this.handleUpload}
              maxfiles={1}
            >
              <button className="secondary core2 mlp-button expand-75">{t('account:addPhoto')}</button>
            </Dropzone>
          </div>
        </div>
      </section>
    );
  };

  renderProfileDetails = (t) => {
    const list = this.props.accountReducer.get(AccountConstants.MEMBER_VIEW, fromJS([]));
    const progress = this.props.accountReducer.get(AccountConstants.PROFILE_OPTIMIZATION, 0);
    return (
      <section className="standard panel text-center" aria-label={t('account:completeAccount')}>
        <div className="row">
          <div className="columns small-12">
            <strong>{list.get(AccountConstants.FIRST_NAME, '')} {list.get(AccountConstants.LAST_NAME, '')}</strong>
          </div>
          <div className="columns small-12">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuetext={`${progress} percent`}
              aria-valuemax="100">
              <div class="progress" style={{ width: `${progress}%` }} />
            </div>
            <p>
              {`${numberWithoutDecimalFormat(progress)} / 100`}
            </p>
          </div>
          <div className="columns small-12 border-top">
            <h2 className="hide-for-small-only hl-medium padding-top-1x padding-bottom-1x collapse">{t('account:accountcomplete')}</h2>
          </div>
          <div className="columns small-12 border-top">
            <p>
              <button className="linklike"
                // onClick={this.toggleDialogVisibility()}
                aria-haspopup="dialog"
              >
                <span>{t('account:addAnEmergencycontact')}</span>
              </button>
            </p>
            <p class="collapse">
              <button className="linklike"
                // onClick={this.toggleDialogVisibility()}
                aria-haspopup="dialog"
              >
                <span>{t('account:verifyemail')}</span>
              </button>
            </p>
          </div>
        </div>
      </section>
    );
  }

  //Rendering Inside Accordion Body
  renderAccordionContentRow = (list) => {
    const {t} = this.props;
    return (
      <MediaQuery minDeviceWidth={640}>
        {(matches) => {
          if (matches) {
            return (
              <div className="bottom-dashed padding-top-1x">
                <div className="row left-2x padding-1x">
                  <div className="columns small-12 medium-4 large-4">
                    <strong>{list.label}</strong>
                  </div>
                  <div className="columns small-12 medium-7 large-6">{list.value}</div>
                  <div className="columns small-12 medium-1 large-2">
                    {list.isEdit && (
                      <button
                        className="circle-button primary core2"
                        onClick={() => this.toggleDialogVisibility(list.uiModalComponent, list.uiModalClass)}
                        aria-haspopup="dialog">
                        <span aria-hidden="true" class="icon icon-pencil icon-1x"/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="bottom-dashed padding-top-1x">
                <div className="row left-2x padding-1x">
                  <div className="columns small-9">
                    <div className="row">
                      <div className="columns small-12">
                        <strong>{list.label}</strong>
                      </div>
                      <div className="columns small-12">{list.value}</div>
                    </div>
                  </div>
                  <div className="columns small-3">
                    {list.isEdit && (
                      <button
                        className="circle-button primary core2"
                        onClick={() => this.toggleDialogVisibility(list.uiModalComponent)}
                        aria-haspopup="dialog">
                        <span aria-hidden="true" class="icon icon-pencil icon-1x" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        }}
      </MediaQuery>
    );
  };


  //Addresses,Email and Phone Numbers body
  renderAddressEmailAndPhone = (t) => {
    let list = this.props.accountReducer;
    let listData = {};
    return (
      <div>
        <div className="dashed-bottom">{list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ADDRESS]) && this.renderAddressTypes()}</div>
        <div className="dashed-bottom">{list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PROP_EMAIL]) && this.renderEmailAddress()}</div>
        <div className="">{list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.MOBILE_NUMBER]) && this.renderMobileNumber()}</div>
      </div>
    );
  };

  // Address types

  getFullAddress = (address) => {
    return(
      <Fragment>
        <p className="collapse">{address.get('addressLine1')}<span className="left-1x collapse">{address.get('addressline2')}</span></p>
        <p className="collapse">{address.get('city')}, {address.get('state')}, {address.get('zipCode')}</p>
      </Fragment>
    );
  }

  renderAddressTypes = () => {
    const {t} = this.props;
    let list = this.props.accountReducer;
    let addressLabel = [t('account:homeAddress'), t('account:alternateAddress'), t('account:billingAddress')];
    let modalAddressTitle = [t('addressdetails:modalHomeTitle'), t('addressdetails:modalAlternateTitle'), t('addressdetails:modalBillingTitle')];
    let modalAddressSubTitle = [t('addressdetails:modalHomeSubTitle'), t('addressdetails:modalAlternateSubTitle'), t('addressdetails:modalBillingSubTitle')];
    let listData = [];
    for (let i = 0; i < list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ADDRESS]).size; i++) {
      listData.push({
        label: addressLabel[i],
        value: this.getFullAddress(list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ADDRESS, i])),
        isEdit: true,
        data: list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ADDRESS]),
        uiModalComponent: this.renderAddressModal(modalAddressTitle[i], modalAddressSubTitle[i]),
        uiModalClass: 'account-modal small',
        key: `renderAddressTypes`,
      });
    }
    return listData.map((listData, index) =>
      <AccordionContentRow
        key={`renderAddressTypes-${index}`}
        showEditModal={(component, modalClass) => this.toggleDialogVisibility(component, modalClass)}
        list={listData}
      />
    );
  };

  renderAddressModal = (title, subTitle) => {
    return <AddressModal
      name="editAddress"
      title={title}
      subTitle={subTitle}
      visible={this.state.modalVisibility}
      onExit={this.toggleDialogVisibility} />;
  }

  //Email
  renderEmailValue = () => {
    const {t} = this.props;
    return (
      <Fragment>
        <span>{this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PROP_EMAIL])}</span>
        <span className="left-2x">
          {this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.IS_EMAIL_VERIFIED]) ? (
            <span>{t('account:verified')}</span>
          ) : (
            <a>{t('account:unverified')}</a>
          )}
        </span>
      </Fragment>
    );
  };

  renderEmailAddress = () => {
    const {t} = this.props;
    let email = this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PROP_EMAIL]);
    let emailList = {
      label: t('account:email'),
      value: this.renderEmailValue(),
      isEdit: true,
      data: email,
      uiModalComponent: this.renderEmailModal(),
      key: 'renderEmailAddress',
      uiModalClass: 'account-modal small',
    };
    return this.renderAccordionContentRow(emailList);
  };

  renderEmailModal = () => {
    return <EmailModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


  //Phone
  renderEditPhoneNumberModal = () => {
    return <PhoneModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };

  renderMobileNumber = () => {
    const {t} = this.props;
    let contactDetails = [
      {
        label: t('account:phone'),
        suffix: 'M:',
        key: AccountConstants.MOBILE_NUMBER,
        labelHide: false,
        verifcationKey: AccountConstants.IS_MOBILE_NUMBER_VERIFIED,
      },
    ];
    let mobileList = [];
    contactDetails.forEach((list, index) => {
      mobileList.push({
        label: !list.labelHide ? list.label : '',
        value: this.renderMobileValue(list),
        isEdit: index === 0 ? true : false,
        data: this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.key]),
        uiModalComponent: this.renderEditPhoneNumberModal(this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.key]), list),
        key: `renderEmailAddress-${index}`,
        uiModalClass: 'account-modal small',
      });
    });
    return mobileList.map((list) => this.renderAccordionContentRow(list));
  };

  renderMobileValue = (list) => {
    const {t} = this.props;
    return (
      <Fragment key={list.key}>
        <span>
          {list.suffix} {phoneNumberFormat(this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.key]))}
        </span>
        <span className="left-2x">
          {this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.verifcationKey]) ? (
            <span>{t('account:verified')}</span>
          ) : (
            <a className="verification_link">{t('account:unverified')}</a>
          )}
        </span>
      </Fragment>
    );
  };

  //Ethnicity and Language Preference
  renderEthnicityLanguagePreference = (t) => {
    return (
    <div>
      {this.renderEthnicity()}
      {this.renderLanguagePreference()}
    </div>
    );
  };

  renderEthnicity = () => {
    const {t} = this.props;
    let ethnicityList = [AccountConstants.PROP_ETHINICITY, AccountConstants.PROP_RACE];
    let list = this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PREFERENCE, 0, AccountConstants.ETHNICITY_AND_LANGUAGE]);
    let ethnicityValue = '';
    let contentList = {};
    if(list) {
      for(let i = 0; i < list.size; i++) {
        if(ethnicityList.indexOf(list.getIn([i, AccountConstants.PROP_TYPE])) > -1) {
          list.get(i).mapKeys((key, value) => {
            ethnicityValue = `${ethnicityValue}  ${list.getIn([i, AccountConstants.PREFER_NOT_TO_PROVIDE]) === AccountConstants.PROP_NO
              && value === AccountConstants.PROP_YES && key !== AccountConstants.PREFER_NOT_TO_PROVIDE > -1  ?
              `${key} ${ethnicityValue.includes('&') ? '' : '&'}` : ''}`
            contentList = {
              label: t('account:ethnicityRace'),
              value: ethnicityValue,
              isEdit: true,
              data: list,
              uiModalComponent: this.renderEthnicityModal(this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.key]), list),
              uiModalClass:'account-modal large',
              key: `renderEthnicityLanguagePreference-${key}`
            }
          });
        }
      }
    return this.renderAccordionContentRow(contentList);
  };
};

  renderEthnicityModal = (list) => {
    return <EthnicityModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };

//Language
  renderLanguagePreference = () => {
    const {t} = this.props;
    let languageList = [
        {key: AccountConstants.SPOKEN_LANGUAGE_PREFERENCE, label: t('account:spokenLanguage') },
        {key: AccountConstants.WRITTEN_LANGUAGE_PREFERENCE, label: t('account:writtenLanguage')}
      ];
    let languageKey = [AccountConstants.SPOKEN_LANGUAGE_PREFERENCE, AccountConstants.WRITTEN_LANGUAGE_PREFERENCE]
    let list = this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PREFERENCE, 0, AccountConstants.ETHNICITY_AND_LANGUAGE]);
    let contentList = [];
    if(list) {
      languageList.map((ethnicity) => {
        let listCheck = [];
        let languageValue = '';
        for(let i = 0; i < list.size; i++) {
          if(languageKey.indexOf(list.getIn([i, AccountConstants.PROP_TYPE])) > -1) {
              if(listCheck.indexOf(ethnicity.label) === -1) {
                contentList.push({
                  label: ethnicity.label,
                  value: list.getIn([i, 'selected']),
                  isEdit: true,
                  data: list,
                  uiModalComponent: this.renderLanguagePreferenceModal(this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, list.key]), list),
                  uiModalClass:'account-modal large',
                  key: `renderLanguagePreference-${ethnicity.key}`
                })
              }
            listCheck = contentList.map((list) => list.label);
          }
        }
      });
      return contentList.map((content) => this.renderAccordionContentRow(content));
    }
  };

  renderLanguagePreferenceModal = () => {
    return <LanguagePreferenceModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


  // Accessibility, Mobility, Transportation
  renderAccessibilityMobilityTransportation = (t) => {
    let list = this.props.accountReducer;
    return (
    <div>
      <div className="dashed-bottom">{this.renderAccessibility()}</div>
      <div className="dashed-bottom">{this.renderMobility()}</div>
      <div className="dashed-bottom">{this.renderDisability()}</div>
      <div className="">{this.renderTransportation()}</div>
    </div>
    );
  };

  //Accessibility
  renderAccessibility = () => {
    const {t} = this.props;
    let accessibility = {
      label: t('account:accessibility'),
      // value: t('account:largeFont'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderAccessibilityModal(),
      uiModalClass: 'account-modal small',
      // key: 'renderEmailAddress',
    };
    return this.renderAccordionContentRow(accessibility);
  };

  renderAccessibilityModal = () => {
    return <AccessibilityModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };

  //Mobility
  renderMobility = () => {
    const {t} = this.props;
    let mobility = {
      label: t('account:mobility'),
      // value: t('account:cane'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderMobilityModal(),
      uiModalClass: 'account-modal large',
      // key: 'renderEmailAddress',
    };
    return this.renderAccordionContentRow(mobility);
  };

  renderMobilityModal = () => {
    return <MobilityModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


  //Disability
  renderDisability = () => {
    const {t} = this.props;
    let disabilityList = {
      label: t('account:disability'),
      // value: t('account:difficultyHearing'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderDisabilityModal(),
      uiModalClass: 'account-modal large',
      // key: 'renderEmailAddress',
    };
    return this.renderAccordionContentRow(disabilityList);
  };

  renderDisabilityModal = () => {
    return <DisabilityModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


  //Transportation
  renderTransportation = () => {
    const {t} = this.props;
    let transportationList = {
      label: t('account:transportation'),
      // value: t('account:selfDriven'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderTransportationModal(),
      uiModalClass: 'account-modal large',
      // key: 'renderEmailAddress',
    };
    return this.renderAccordionContentRow(transportationList);
  };

  renderTransportationModal = () => {
    return <TransportationModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


  // Account Management
  renderAccountManagement = (t) => {
    return ( this.renderChangePassword() );
  };

  renderChangePassword = () => {
    const {t} = this.props;
    let changePassword = this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ACCOUNT_MANAGEMENT, AccountConstants.CHANGE_PASSWORD]);
    let accountManagement = {
      label: t('account:changePassword'),
      value: changePassword,
      isEdit: true,
      data: changePassword,
      uiModalComponent: this.renderChangePasswordModal(),
      key: 'renderAccountManagement',
      uiModalClass: 'account-modal large'
    };
    return this.renderAccordionContentRow(accountManagement);
  };

  renderChangePasswordModal = () => {
    return <PasswordModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };


// Payment Methods
  renderPaymentMethods = (t) => {
    return (
      <div>
        {/* <AddPaymentMethod /> */}
      </div>
    );
  };

// Emergency Contacts
  renderEmergencyContact = (t) => {
    let list = this.props.accountReducer;
    return (
      <div>
        {list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT]) && this.renderContact()}
        {this.renderAddContact()}
      </div>
    );
  };

  //For Displaying existing contact
  getContactDetails = (contact) => {
    const {t} = this.props
    return (
      <div className="row">
        <div className="columns small-5 contact-avatar" title="Profile" aria-label={t('account:profile')}>
          <img src="images/circular-image-treatment.jpg" alt=""/>
        </div>
        <div className="columns small-7">
          <p className="collapse">{contact.get('firstName')} {contact.get('lastName')}</p>
          <p className="collapse">{contact.get('relationship')}</p>
          <a>{t('account:remove')}</a>
        </div>
      </div>
    )
  }

// If needed to display  more than phone number in the value section can add it here
  getContactPhoneNumber = (contact) =>{
    return(<span>{phoneNumberFormat(contact.get('phoneNum'))}</span>)
  }

  renderContact = (contact) => {
    const {t} = this.props;
    let list = this.props.accountReducer;
    let contactData = [];
    const emergencyContact = list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT])
    if(emergencyContact){
    for (let i = 0; i < emergencyContact.size; i++) {
      contactData.push({
        label: this.getContactDetails(emergencyContact.get(i)),
        value: this.getContactPhoneNumber(emergencyContact.get(i)),
        isEdit: true,
        data: list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.EMERGENCY_CONTACT]),
        key: `renderContact`,
        uiModalComponent: this.renderContactModal(),
        uiModalClass: 'account-modal large'
      });
    }
    return contactData.map((contactData) => this.renderAccordionContentRow(contactData));
    }
  }

  renderContactModal = () => {
    return <EmergencyContactModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  };

  //For Displaying Add Contact row
  renderAddContact = () => {
    const {t} = this.props;
    let addContact = {
      label: <div className="columns small-5 icon icon-user icon-2x"></div>,
      value: t('account:addEmergencyContact'),
      isEdit: true,
     // uiModalComponent: ,
    };
    return this.renderAccordionContentRow(addContact);
  };

  // renderAddContactModal = () => {
  //   return <AddContactModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  // };


// Legal Settings
renderLegalSettings = () => {
  const {t} = this.props
  return (
    <div>
      {this.renderFinancialPower()}
      {this.renderHealthCarePower()}
      {this.renderLegalForms()}
    </div>
  );
};

  renderFinancialPower = () =>{
    const {t} = this.props

    let financialPower = {
      label: t('account:financialPower'),
      isEdit: true,
    };
    return this.renderAccordionContentRow(financialPower);
  }

  renderHealthCarePower = () =>{
    const {t} = this.props

    let healthCarePower = {
      label: t('account:healthCarePower'),
      isEdit: true,
    };
    return this.renderAccordionContentRow(healthCarePower);
  }

  renderLegalForms = () =>{
    const {t} = this.props

    let legalForms = {
      label: t('account:legalForms'),
      isEdit: true,
    };
    return this.renderAccordionContentRow(legalForms);
  }


  //Right-Section of Account
  renderProfileSettings = (t) => {
    const accordionContent = [
      {
        ariaLabel: t('account:accordionHeaders.addressEmailAndPhone'),
        header: t('account:accordionHeaders.addressEmailAndPhone'),
        body: <div className="flush">{this.renderAddressEmailAndPhone(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.ethnicityLanguagePreference'),
        header: t('account:accordionHeaders.ethnicityLanguagePreference'),
        body: <div className="flush">{this.renderEthnicityLanguagePreference(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        header: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        body: <div className="flush">{this.renderAccessibilityMobilityTransportation(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.accountManagement'),
        header: t('account:accordionHeaders.accountManagement'),
        body: <div className="flush">{this.renderAccountManagement(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.paymentMethods'),
        header: t('account:accordionHeaders.paymentMethods'),
        body: <div className="flush">{this.renderPaymentMethods(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.emergencyContact'),
        header: t('account:accordionHeaders.emergencyContact'),
        body: <div className="flush">{this.renderEmergencyContact(t)}</div>,
      },
      {
        ariaLabel: t('account:accordionHeaders.legalSettings'),
        header: t('account:accordionHeaders.legalSettings'),
        body: <div className="flush">{this.renderLegalSettings(t)}</div>,
      },
    ];
    return (
      <div>
        <UIModal visible={this.state.modalVisibility} onExit={this.toggleDialogVisibility} dialogClasses={this.state.modalClass}>
          {this.state.modalComponent}
        </UIModal>
        <Loader isFetching={this.props.accountReducer.get(GlobalConstants.PROP_FETCHING)}>
          <UIAccordion className="accordion naked" openFirstPanelOnDefault>{accordionContent}</UIAccordion>
        </Loader>
      </div>
    );
  };

  renderIdCardPanel = (t) =>{
    return(
      <section className="standard panel text-center" aria-label={t('account:viewCard')}>
        <div className="row head border-bottom">
          <div className="columns small-12">
            <h2 className="hl-medium">{t('account:viewYourIdCard')}</h2>
          </div>
        </div>
        <div className="row body top-1x">
          <div className="columns small-12">
            <p className="collapse text-left padding-left-4x">{t('account:needYourIdToday')}</p>
            <p className="collapse text-left padding-left-4x">{t('account:printIdForProof')}</p>
            <Link to={links.IDCARD} className="button primary core2 top-1x collapse">
              <span>{t('account:viewIdCard')}</span>
            </Link>
          </div>
        </div>
      </section>
    )
  }


  render() {
    const {t} = this.props;
    return (
      <Fragment>
        <div className="row">
          <div className="columns small-12">
            <h1 className="hl-xxlarge">{t('account:title')}</h1>
          </div>
        </div>
        <div className="rows top-4x">
          <div className="columns small-12 medium-4 large-4">
            {this.renderProfileImage(t)}
            {this.renderProfileDetails(t)}
            {this.renderIdCardPanel(t)}
          </div>
          <section className="columns small-12 medium-8 large-8 bottom-1x shadow my-account-wrapper" aria-label={t('account:profile')}>
            {this.renderProfileSettings(t)}
          </section>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = store => {
  return {
    accountReducer: store.AccountDetailReducer,
    profileImgReducer: store.ProfileImageReducer,
  };
}

export default connect(mapStateToProps)(Account);
