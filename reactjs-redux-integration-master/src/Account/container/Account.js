import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { translate } from "react-i18next";
import {fromJS} from 'immutable';
import * as links from "constants/routes";

import {numberWithoutDecimalFormat} from 'modules/Utility';

import UIModal from "UI/UIModal";
import UIAccordion from "UI/UIAccordion";
import UIDropZone from "UI/UIDropZone";
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

    return state;
  };

  componentDidMount() {
    this.props.dispatch(AccountDetailActions.fetchAccountDetails());
  }

  toggleDialogVisibility = () => {
    this.setState((prevState) => {
      return { 
        modalVisibility: !prevState.modalVisibility
      }
    })
  };

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
        <button className="image-icon">
          <span aria-hidden="true" class="icon icon-1x icon-pencil"></span>
        </button>
        <div class="top-5x">
          <h2 class="hl-medium">{list.get('MemberFirstName')} {list.get('MemberLastName')}</h2>
          <div class="progress-bar" role="progressbar" tabindex="0" aria-valuenow={progress} aria-valuemin="0"
            aria-valuetext={`${progress} percent`}
            aria-valuemax="100">
            <div class="progress" style={{width:`${progress}%`}}></div>
          </div>
          <p><span className="font">{numberWithoutDecimalFormat(progress)}</span> / 100</p>
          <hr className="collapse" />
          <p><strong>{t("account:accountcomplete")}</strong></p>
          <hr className="collapse" />
          <p><a href="#" className="font">{t("account:emergencycontact")}</a></p>
          <p><a href="#" className="font">{t("account:verifyemail")}</a></p>
        </div>
      </div>
    );
  };

  renderAddressEmailAndPhone = (t) => {
    return <div className="row">
        <div className="columns small-12 medium-4 large-4" />
        <div className="columns small-12 medium-7 large-7" />
        <div className="columns small-12 medium-1 large-1">
          <button className="image-icon-text" onClick={this.toggleDialogVisibility} aria-haspopup="dialog">
            <span aria-hidden="true" class="icon icon-1x icon-pencil" />
            <div>{t("button.edit")}</div>
          </button>
        <UIModal visible={this.state.modalVisibility} onExit={this.toggleDialogVisibility}>
          <div className="row head">
            <div className="columns small-11">
              <h2 id="modal-title" className="left-3x">
                  Header
                </h2>
            </div>
            <div className="columns small-1">
              <button aria-label="close-dialog" title="close-dialog" onClick={this.toggleDialogVisibility} />
            </div>
          </div>
          <div className="row body">
            <p>Hello world</p>
          </div>
          <div className="row top-2x">
            <div className="columns small-12">
              <button className="button secondary columns small-5" onClick={this.toggleDialogVisibility}>
                Close
                </button>
            </div>
          </div>
        </UIModal>
        </div>
      </div>;
  };

  renderEthnicityLanguagePreference = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderAccessibilityMobilityTransportation = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderAccountManagement = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderPaymentMethods = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderEmergencyContact = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderLegalSettings = (t) => {
    return(
      <div>
      </div>
    );
  };

  renderProfileDetail = () => {
    const {t} = this.props;
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
    return(
      <div>
        <UIAccordion>
          {accordionContent}
        </UIAccordion>
      </div>
    )
  }
  // renderProfileDetail = () => {
  //   const { t } = this.props;
  //   let paymentSelection = [{ label: "Set as Default", value: "1" }];
  //   const accordionContent = [
  //     {
  //       header: "Addresses, Email and Phone Numbers",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <h4>
  //               <strong>{t("account:address")}</strong>
  //             </h4>
  //             <div className="accordion-item-meta">
  //               <p>{t("account:addressdetails")}</p>
  //               <p>{t("account:city")}</p>
  //             </div>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:alternateaddress")}</strong>
  //               {t("account:alternateaddressdetails")}
  //             </p>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:billingaddress")}</strong>
  //             </p>
  //           </div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:email")}</strong>
  //               {t("account:emailaddress")}
  //             </p>
  //             <p class="accordion-item-edit">
  //               <a href="#">{t("account:verification")}</a>
  //             </p>
  //           </div>
  //         </div>
  //       )
  //     },
  //     {
  //       header: "Ethnicity and Language Preference",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:ethnicity")}</strong>
  //               {t("account:ethnicitytype")}
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:spokenlanguage")}</strong>
  //               {t("account:english")}
  //             </p>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:writtenlanguage")}</strong>
  //               {t("account:english")}
  //             </p>
  //           </div>
  //         </div>
  //       )
  //     },
  //     {
  //       header: "Accessibility, Mobility, Disability and Transportation",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:accessibility")}</strong>
  //               {t("account:accessibilitytype")}
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:mobility")}</strong>
  //               {t("account:mobilitytype")}
  //             </p>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:disability")}</strong>
  //             </p>
  //           </div>
  //           <div>
  //             <p>
  //               <strong>{t("account:transportation")}</strong>
  //               {t("account:transportationtype")}
  //             </p>
  //           </div>
  //         </div>
  //       )
  //     },
  //     {
  //       header: "Payment Methods",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:cardtype")}</strong>
  //               {t("account:cardnumber")}
  //             </p>
  //             <div>{t("account:expdate")}</div>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //             <div className="fieldset">
  //               <UIRadioSelection
  //                 label=""
  //                 name="metals"
  //                 defaultValue={"1"}
  //                 choices={paymentSelection}
  //                 onValidatedChange={this.paymentChange}
  //               />
  //             </div>
  //           </div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:accountype")}</strong>
  //               {t("account:accountno")}
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //             <div className="fieldset">
  //               <UIRadioSelection
  //                 label=""
  //                 name="metals"
  //                 defaultValue={"1"}
  //                 choices={paymentSelection}
  //                 onValidatedChange={this.paymentChange}
  //               />
  //             </div>
  //           </div>
  //           {this.renderChangePassword()}
  //         </div>
  //       )
  //     },
  //     {
  //       header: "Emergency Contact",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>
  //                 {t("account:emergencyname")}
  //                 {t("account:relation")}
  //               </strong>
  //               {t("account:contactno")}
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:addemergency")}</strong>
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     },
  //     {
  //       header: "Legal Settings",
  //       body: (
  //         <div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:poa")}</strong>
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:hpoa")}</strong>
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //           <div className="accordion-item-details">
  //             <p>
  //               <strong>{t("account:legalforms")}</strong>
  //             </p>
  //             <div className="accordion-item-edit">
  //               <img
  //                 alt="edit icon"
  //                 src="http://bcbsfl.protoshare.com/wa/asset?oid=5928"
  //                 class="s9-content pointer"
  //                 onClick={this.toggle}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     }
  //   ];
  //   return (
  //     <div class="account-grid-item-2">
  //       <UIAccordion>{accordionContent}</UIAccordion>
  //     </div>
  //   );
  // };

  // toggle = () => {
  //   this.setState(prevState => ({
  //     modalVisibility: !prevState.modalVisibility
  //   }));
  // };

  // renderChangePassword = () => {
  //   let agree = [
  //     {
  //       label:
  //         "Yes, I want to recieve all future communications electronically",
  //       value: "nil"
  //     }
  //   ];
  //   const { t } = this.props;
  //   return (
  //     <UIModal visible={this.state.modalVisibility} onExit={this.onModalExit}>
  //       <div className="row head">
  //         <div className="columns small-1">
  //           <button
  //             aria-label="close-dialog"
  //             title="close-dialog"
  //             onClick={this.onModalExit}
  //           />
  //         </div>
  //       </div>

  //       <div class="change-password-modal">
  //         <h2 class="modal-header">{t("account:changepassword")}</h2>
  //         <section class="modal-body">
  //           <div class="modal-form">
  //             <div class="modal-form-group">
  //               <label className="modal-form-group-label" for="password">
  //                 {t("account:password")}
  //               </label>
  //               <input
  //                 type="text"
  //                 name="password"
  //                 placeholder="Enter Password"
  //                 id="password"
  //               />
  //             </div>
  //             <div class="modal-form-group">
  //               <span className="modal-form-group-label">
  //                 {t("account:passwordstrength")} : {t("account:passwordtype")}
  //               </span>
  //             </div>
  //             <div class="password-strength" />
  //             <div class="modal-form-group">
  //               <label
  //                 className="modal-form-group-label"
  //                 for="confirm-password"
  //               >
  //                 {t("account:confirmpassword")}
  //               </label>
  //               <input
  //                 type="password"
  //                 name="confirm-password"
  //                 placeholder="Confirm Your Password"
  //                 id="confirm-password"
  //               />
  //             </div>
  //             <div class="modal-form-group">
  //               <div className="modal-hlp-txt">
  //                 <UICheckSelection
  //                   label=""
  //                   name="agree"
  //                   class="fieldset"
  //                   defaultValue={["1"]}
  //                   choices={agree}
  //                   onValidatedChange={this.paymentChange}
  //                   hasNoneOfTheAbove={true}
  //                 />
  //               </div>
  //             </div>
  //             <div class="icon icon-exclamation-circle password-tooltip" />
  //             <span className="tooltip-text">{t("account:readmore")}</span>
  //           </div>
  //           <div class="password-guidelines">
  //             <h3 class="guidelines-header">{t("account:guidelines")}</h3>
  //             <h4 class="guidelines-sub-header">
  //               {t("account:passwordexample")}
  //             </h4>
  //             <div class="guidelines-description">
  //               <p>{t("account:guidelinesdescription-1")}</p>
  //               <p>{t("account:guidelinesdescription-2")}</p>
  //               <p>{t("account:guidelinesdescription-3")}</p>
  //               <p>{t("account:guidelinesdescription-4")}</p>
  //               <p>{t("account:guidelinesdescription-5")}</p>
  //               <p>{t("account:guidelinesdescription-6")}</p>
  //               <p>{t("account:guidelinesdescription-7")}</p>
  //             </div>
  //           </div>
  //         </section>
  //         <div class="modal-footer">
  //           <button class="modal-btn primary-btn" onClick={this.onModalExit}>
  //             {t("account:Close")}
  //           </button>
  //           <button class="modal-btn secondary-btn" onClick={this.handleSubmit}>
  //             {t("account:savechanges")}
  //           </button>
  //         </div>
  //         {this.renderPasswordConfirmation()}
  //       </div>
  //     </UIModal>
  //   );
  // };
  // paymentChange = () => { };
  // handleSubmit = () => {
  //   this.setState(prevState => ({
  //     passwordConfirmation: !prevState.passwordConfirmation
  //   }));
  // };
  // onModalExit = () => {
  //   this.setState({ modalVisibility: false });
  // };
  // renderPasswordConfirmation = () => {
  //   console.log("renderPasswordConfirmation");
  //   const { t } = this.props;
  //   return (
  //     <UIModal
  //       visible={this.state.passwordConfirmation}
  //       onExit={this.onModalExit}
  //     >
  //       <div className="changepassword-main">
  //         <div className="changepassword-sub">
  //           <div className="icon icon-check success-icon" />
  //           <div className="confirmation-icon" />
  //         </div>
  //         <h2 className="confirmation-status">{t("account:success")}</h2>
  //         <p className="confirmation-msg">{t("account:successmsg")}</p>
  //         <button class="confirmation-btn" onClick={this.onModalExit}>
  //           {t("account:ok")}
  //         </button>
  //       </div>
  //     </UIModal>
  //   );
  // };

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
          <div className="columns small-12 medium-4 large-4">
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
