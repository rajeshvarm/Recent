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
    this.props.dispatch(AccountDetailActions.fetchProfileImg());
  }

  toggleDialogVisibility = (component, modalClass) => {
    this.setState((prevState) => {
      console.log('modalass', modalClass)
      return {
        modalVisibility: !prevState.modalVisibility,
        modalComponent: component ? component : '',
        modalClass: modalClass ? modalClass : ''
      };
    });
  };

  handleUpload = file => {
    console.log("Uploaded New file", file);
    this.props.dispatch(AccountDetailActions.uploadProfileImg(file));
    return;
  };
  //Left-Section of Account
  renderProfile = (t) => {
    const list = this.props.accountReducer.get(AccountConstants.MEMBER_VIEW, fromJS([]));
    const progress = this.props.accountReducer.get(AccountConstants.PROFILE_OPTIMIZATION, 0);
    const profileImg = this.props.profileImgReducer.get(AccountConstants.PROP_PROFILE_IMG);
    
    return (
      <div className="standard panel text-center">
        <div className="border-image">
          <img id="profileImage" src={`data:image/png;base64,${profileImg}`} alt="" />
        </div>
        <Dropzone 
          className={`profile-image-uploader`}
          onDrop={this.handleUpload}
          maxfiles={1}
          >
          <button className="image-icon hide-for-small-only">
            <span aria-hidden="true" class="icon icon-1x icon-pencil" />
          </button>
        </Dropzone>
        <div class="top-4x">
          <strong>{list.get(AccountConstants.FIRST_NAME, '')} {list.get(AccountConstants.LAST_NAME, '')}</strong>
          <MediaQuery maxDeviceWidth={640}>
            <div className="row button-margin">
              <Dropzone 
                className={`profile-image-uploader`}
                onDrop={this.handleUpload}
                maxfiles={1}
                >
                  <div className="columns small-12">
                    <button className="primary core2 expand">{t('account:uploadPhoto')}</button>
                  </div>
              </Dropzone>
              <div className="columns small-12">
                <button className="secondary core2 expand">{t('account:removoPhoto')}</button>
              </div>
            </div>
          </MediaQuery>
          <div
            class="progress-bar"
            role="progressbar"
            tabIndex="0"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuetext={`${progress} percent`}
            aria-valuemax="100">
            <div class="progress" style={{width: `${progress}%`}} />
          </div>
          <p>
            <span>{numberWithoutDecimalFormat(progress)}</span> / 100
          </p>
          <hr className="collapse" />
          <h2 className="hide-for-small-only hl-medium">{t('account:accountcomplete')}</h2>
          <hr className="collapse hide-for-small-only" />
          <p>
            <a href="#">{t('account:addAnEmergencycontact')}</a>
          </p>
          <p>
            <a href="#">{t('account:verifyemail')}</a>
          </p>
        </div>
      </div>
    );
  };

  //Rendering Inside Accordion Body
  renderAccordionContentRow = (list) => {
    const {t} = this.props;
    return (
      <MediaQuery minDeviceWidth={640}>
        {(matches) => {
          if (matches) {
            return (
              <Fragment>
                <div className="row">
                  <div className="columns small-12 medium-4 large-4 top-1x">
                    <strong>{list.label}</strong>
                  </div>
                  <div className="columns small-12 medium-7 large-6 top-1x">{list.value}</div>
                  <div className="columns small-12 medium-1 large-2 text-right">
                    {list.isEdit && (
                      <button
                        className="image-icon-text"
                        onClick={() => this.toggleDialogVisibility(list.uiModalComponent)}
                        aria-haspopup="dialog">
                        <span aria-hidden="true" class="icon icon-pencil"/>
                      </button>
                    )}
                  </div>
                </div>
                <div className="dashed-divider"/>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <div className="row">
                  <div className="columns small-9">
                    <div className="row">
                      <div className="columns small-12">
                        <strong>{list.label}</strong>
                      </div>
                      <div className="columns small-12">{list.value}</div>
                    </div>
                  </div>
                  <div className="columns small-3 text-right">
                    {list.isEdit && (
                      <button
                        className="image-icon-text"
                        onClick={() => this.toggleDialogVisibility(list.uiModalComponent)}
                        aria-haspopup="dialog">
                        <span aria-hidden="true" class="icon icon-pencil" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="dashed-divider"/>
              </Fragment>
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
        {list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.ADDRESS]) && this.renderAddressTypes()}
        {list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PROP_EMAIL]) && this.renderEmailAddress()}
        {list.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.MOBILE_NUMBER]) && this.renderMobileNumber()}
      </div>
    );
  };

  // Address types

  getFullAddress = (address) => {
    return(
      <Fragment>
        <p className="collapse">{address.get('AddressLine1')}</p>
        <p className="collapse">{address.get('addressline2')}</p>
        <p className="collapse">{address.get('City')}, {address.get('State')}, {address.get('ZipCode')}</p>
      </Fragment>
    );
  }

  renderAddressTypes = () => {
    const {t} = this.props;
    let list = this.props.accountReducer;
    let addressLabel = [t('account:home'), t('account:alternateAddress'), t('account:billingAddress')];
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
        //uiModalClass: 'claims-download-modal',
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

  //Email
  renderEmailValue = () => {
    const {t} = this.props;
    return (
      <Fragment>
        <span>{this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.PROP_EMAIL])}</span>
        <span className="left-2x">
          {this.props.accountReducer.getIn([AccountConstants.MEMBER_VIEW, AccountConstants.IS_EMAIL_VERIFIED]) ? (
            <span className="green">{t('account:verified')}</span>
          ) : (
            <a>{t('account:unverified')}</a>
          )}
        </span>
      </Fragment>
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
       // uiModalClass: 'claims-download-modal',
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
            <span className="green">{t('account:verified')}</span>
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
      {this.renderAccessibility()}
      {this.renderMobility()}
      {this.renderDisability()}
      {this.renderTransportation()}
    </div>
    );
  };

  //Accessibility
  renderAccessibility = () => {
    const {t} = this.props;
    let accessibility = {
      label: t('account:accessibility'),
      value: t('account:largeFont'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderAccessibilityModal(),
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
      value: t('account:cane'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderMobilityModal(),
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
      value: t('account:difficultyHearing'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderDisabilityModal(),
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
      value: t('account:selfDriven'),
      isEdit: true,
      // data: email,
      uiModalComponent: this.renderTransportationModal(),
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
        <div className="columns small-5">
          Image
        </div>
        <div className="columns small-7">
          <p className="collapse">{contact.get('FirstName')} {contact.get('LastName')}</p>
          <p className="collapse">{contact.get('Relationship')}</p>
          <a>{t('account:remove')}</a>
        </div>
      </div>
    )
  }

// If needed to display  more than phone number in the value section can add it here
  getContactPhoneNumber = (contact) =>{
    return(<span>{phoneNumberFormat(contact.get('PhoneNum'))}</span>)
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
      });
    }
    return contactData.map((contactData) => this.renderAccordionContentRow(contactData));
    }
  }

  // renderContactModal = () => {
  //   return <ContactModal data={this.props.accountReducer} onExitModal={this.toggleDialogVisibility} />;
  // };

  //For Displaying Add Contact row
  renderAddContact = () => {
    const {t} = this.props;
    let addContact = {
      label: "Image",
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
        body: this.renderAddressEmailAndPhone(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.ethnicityLanguagePreference'),
        header: t('account:accordionHeaders.ethnicityLanguagePreference'),
        body: this.renderEthnicityLanguagePreference(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        header: t('account:accordionHeaders.accessibilityMobilityTransportation'),
        body: this.renderAccessibilityMobilityTransportation(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.accountManagement'),
        header: t('account:accordionHeaders.accountManagement'),
        body: this.renderAccountManagement(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.paymentMethods'),
        header: t('account:accordionHeaders.paymentMethods'),
        body: this.renderPaymentMethods(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.emergencyContact'),
        header: t('account:accordionHeaders.emergencyContact'),
        body: this.renderEmergencyContact(t),
      },
      {
        ariaLabel: t('account:accordionHeaders.legalSettings'),
        header: t('account:accordionHeaders.legalSettings'),
        body: this.renderLegalSettings(t),
      },
    ];
    return (
      <div>
        <UIAccordion className="accordion naked" openFirstPanelOnDefault>{accordionContent}</UIAccordion>
        <UIModal visible={this.state.modalVisibility} onExit={this.toggleDialogVisibility} dialogClasses={this.state.modalClass}>
          {this.state.modalComponent}
        </UIModal>
      </div>
    );
  };

  renderIdCardPanel = (t) =>{
    return(
      <div className="standard panel text-center">
        <div className="row head">
          <div className="columns small-12">
            <h2 className="hl-medium">{t('account:viewYourIdCard')}</h2>
          </div>
        </div>
        <hr className="collapse"/>
        <div className="row body top-1x">
          <div className="columns small-12">
            <p className="collapse text-left padding-left-4x">{t('account:needYourIdToday')}</p>
            <p className="collapse text-left padding-left-4x">{t('account:printIdForProof')}</p>
            <Link to={links.IDCARD} className="button primary core2 top-1x">
              <span>{t('account:viewIdCard')}</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }


  render() {
    const {t} = this.props;
    return (
      <Fragment>
        <div className="row">
          <div className="columns small-12">
            <h1>{t('account:title')}</h1>
          </div>
        </div>
        <div className="rows top-4x">
          <div className="columns small-12 medium-4 large-4">
            {this.renderProfile(t)}
            {this.renderIdCardPanel(t)}
          </div>
          <div className="columns small-12 medium-8 large-8 bottom-1x">{this.renderProfileSettings(t)}</div>
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