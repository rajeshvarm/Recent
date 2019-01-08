import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { translate } from "react-i18next";
import * as links from "constants/routes";

import UIModal from "UI/UIModal";
import UIAccordion from "UI/UIAccordion";
import UIRadioSelection from "UI/UIRadioSelection";
import UICheckSelection from "UI/UICheckSelection";

import * as AccountDetailActions from '../actions';

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

    props.dispatch(AccountDetailActions.fetchAccountDetails());
    
    return state;
  };

  componentDidMount() {
    this.props.dispatch(AccountDetailActions.fetchAccountDetails());
  }
  
  renderProfileDiv = () => {
    const { t } = this.props;
    console.log("account1",this.props)
    return (
      <div class="account">
        <div class="profile-pic">
          <img src="images/circular-image-treatment.jpg" />
        </div>
        <div class="top-4x">
          <h2 class="hl-medium">{t("account:membername")}</h2>
          <div class="" />
          <p class="">
            <span>{t("account:profilepercent")}</span>
            {t("account:profiletotal")}
          </p>
        </div>
        <hr className="collapse"/>
        <div class="">
          <strong>{t("account:accountcomplete")}</strong>
        </div>
        <hr className="collapse"/>
        <div class="">
          <p class="">
            <a href="#">{t("account:emergencycontact")}</a>
          </p>
          <p class="">
            <a href="#">{t("account:verifyemail")}</a>
          </p>
        </div>
      </div>
    );
  };

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
          <div className="small-12 medium-4 large-4">
            {this.renderProfileDiv()}
          </div>
          <div className="small-12 medium-8 large-8">
            {/* {this.renderProfileDetail()} */}
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
