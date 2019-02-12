import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import MediaQuery from "react-responsive";
import PieChart from "components/PieChart";

import UIAccordion from "UI/UIAccordion";
import UITabSwitcher from 'UI/UITabSwitcher';
import * as links from "constants/routes";
import * as Actions from "../actions";
import * as OverviewConstants from 'constants/claims';
import * as GlobalConstants from 'constants/global';
import { priceUSDFormat, getRGBToHexColorConverter } from "modules/Utility";
import Loader from 'components/Loader';

@translate(["common", "claims"])
class ClaimDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleAccordion: false
    };
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchClaimOverview());
  }

  toggleAccordions = () => {
    this.setState({ toggleAccordion: !this.state.toggleAccordion });
  };

  renderOverviewDetails = (t, overViewData) => {
    let claimsData =  overViewData.getIn([OverviewConstants.CLAIM_DETAILS]);

    return (
      <Fragment>
        <div className="panel standard">
          <div className="row head">
            <div className="columns small-12">
              <h2 className="hl-medium">
                {t("claims:claimsoverview.overview")}
              </h2>
            </div>
          </div>
          <div className="row body">
            <div className="columns small-12">
              {this.renderOverview(claimsData)}
              <div className="top-1x">
                <strong>{t("claims:claimsoverview.description")}</strong>
              </div>
              <p></p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  renderOverview = (claimsData) => {
    const overview = [
      { label: "Status:", key: "status" },
      { label: "Claim Service Date:", key: "claimProcessedDate" },
      { label: "Claim Type:", key: "claimType" },
      { label: "Member Number:", key: "memberNumber" },
      { label: "Provider Name:", key: "providerName" },
      { label: "Diagnosis Code:", key: "diagnosisCode" }
    ];
    return (
      <div>
        {overview.map((item, index) => {
          return (
            <div className="row padding-1x">
              <strong className="columns small-5">{item.label}</strong>
              <div className="columns small-7 text-right padding-right-1x">
                {claimsData.toJS()[item.key]}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderBillingDetails = (t, list) => {
    const breakdown = [
      { label: "Deductible:", key: "deductibleAmount" },
      { label: "Co-Payment:", key: "copaymentAmount" },
      { label: "Co-Insurance:", key: "coinsuranceAmount" },
      { label: "Not Covered:", key: "" }
    ];
    let claimsData = list.getIn([OverviewConstants.CLAIM_PAID]);
    let overView = list.getIn([OverviewConstants.SERVICES]);
    
    let reformedClaims = [];
    let axisKey = ["totalMemberResponsibility", "serviceFloridaBluePaid"]
    for (let i = 0; i < axisKey.length; i++) {
      reformedClaims.push(parseFloat(claimsData.toJS()[axisKey[i]].replace("$", "")));
    }

    return (
      <div className="panel standard">
        <div className="row head">
          <div className="columns small-12">
            <h2 className="hl-medium">
              {t("claims:claimsoverview.billingdetails")}
            </h2>
          </div>
        </div>
        <div className="row body">
          <div className="columns small-12 medium-12 large-5 text-center">
            <PieChart
              data={reformedClaims}
              height={200}
              width={250}
              cutoutPercentage={0}
              legendLabels={[t("claims:claimsoverview.memberResponsibility"), t("claims:claimsoverview.floridaBluePaid")]}
              colorRefClassName={"claimsColorRef"}
            />
          </div>
          <div className="columns small-12 medium-12 large-7">
            <div className="row">
              <div className="columns small-12">
                <div className="row">
                  <div className="columns small-7">
                    {t("claims:claimsoverview.providerBilled")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.get("providerBilled"))}
                  </div>
                </div>
                <div className="border-bottom top-1x bottom-1x" />
                <div className="row">
                  <div className="columns small-7">
                    {t("claims:claimsoverview.memberDiscount")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.get("serviceMemberDiscount"))}
                  </div>
                  <div className="columns small-7">
                    {t("claims:claimsoverview.floridaBluePaid")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.get("serviceFloridaBluePaid"))}
                  </div>
                </div>
                <div className="border-bottom top-1x bottom-1x" />
                <div className="row">
                  <strong className="columns small-7">
                    {t("claims:claimsoverview.memberResponsibility")}
                  </strong>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.get("totalMemberResponsibility"))}
                  </div>
                </div>
              </div>
            </div>
            <div className="callout top left-4x">
              {breakdown.map((item, index) => {
                return (
                  <div className="row">
                    <div className="columns small-6">{item.label}</div>
                    <div className="columns small-6 text-right">
                      {(overView.toJS()[item.key])}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSavingAlert = () => {
    return (
      <div className="row">
        <div className="small-12 columns">
          <div className="panel standard">
            <div className="row">
              <div className="columns small-12 medium-5 large-5">
                <div className="row head">
                  <div className="columns">
                    <h2 className="hl-medium">Congrats!</h2>
                  </div>
                </div>
                <div className="row body">
                  <div className="columns">
                    <p>You saved $250 by choosing generic over brand</p>
                  </div>
                </div>
              </div>
              <div className="columns small-12 medium-7 medium-7 border rounded padding-2x">
                <div className="row head">
                  <div className="columns">
                    <span className="icon icon-money padding-right-1x" />
                    <strong>Savings Alert!</strong>
                  </div>
                </div>
                <div className="row body">
                  <div className="columns">
                    <p>You could have saved $ by choosing Urgent Care</p>
                    <a href="#" class="promo4">Find Urgent Care</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };

  renderServiceDetails = (t, overViewData) => {
    let serviceViewData = overViewData.getIn([OverviewConstants.SERVICES]);
    let openAccoridon = this.state.toggleAccordion ? serviceViewData.size : 0;
    return (
      <div className="row">
        <div className="small-12 columns">
          <div className="panel standard">
            <div className="row head">
              <div className="columns small-8 medium-6">
                <h2 className="hl-medium">
                  {t("claims:claimsoverview.servicesunderclaim")}
                </h2>
              </div>
              <div className="columns small-4 top-1x text-right">
                <button className="linklike" onClick={this.toggleAccordions}>
                  <span>
                    {this.state.toggleAccordion ? "Collapse all" : "Expand all"}
                  </span>
                </button>
              </div>
            </div>
            <div className="row body">
              <div className="columns small-12">
                <UIAccordion
                  className="accordion naked"
                  openAllNPanels={openAccoridon}
                  allowManyPanelsToBeOpen={true}
                >
                  {this.renderAccordion(t, serviceViewData)}
                </UIAccordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderBreakdown = (list, breakdown, position) => {
    return (
      <div className={`columns small-12 large-4 callout ${position} top-4x small-top-1x text-left`}>
        {breakdown.map((item, index) => {
          return (
            <div className="row">
              <div className="columns small-7">{item.label}</div>
              <div className="columns small-5 text-right">
                {(list[item.key])}
              </div>
            </div>
          );
        })}
      </div>
    )
  }

  renderAccordion = (t, serviceViewData) => {
    const accordionContent = [];
    serviceViewData.toJS().forEach((list, index) => {
      accordionContent.push({
        ariaLabel: list.serviceProvider,
        header: this.renderAccordionHeader(list, t),
        body: this.renderAccordionBody(list, t)
      });
    });
    return accordionContent;
  };

  renderAccordionHeader = (list) => {
    return <div>{`${list.claimServiceDateStart} - ${list.claimServiceDateEnd}`}</div>;
    };

  renderAccordionBody = (list, t) => {
    const breakdown = [
      { label: "Deductible:", key: "deductibleAmount" },
      { label: "Co-Payment:", key: "copaymentAmount" },
      { label: "Co-Insurance:", key: "coinsuranceAmount" },
      { label: "Not Covered:", key: "serviceNetAmountCharge" }
    ];
    let reformedList = [];
    let axisKey = ["serviceMemberResponsibility", "serviceFloridaBluePaid"]
    for (let i = 0; i < axisKey.length; i++) {
      reformedList.push(parseFloat(list[axisKey[i]].replace("$", "")));
    }

    return <div>
      <div className="row">
        <div className="columns small-12">
          <strong>{t("claims:claimsoverview.procedureCode")}</strong>
        </div>
        <div className="columns small-12">
          <p>{list.procedureCode}</p>
          {/* <p>{list.procedureCode ? list.procedureCode : "N/A"}</p> */}
        </div>
        <div className="columns small-12 top-1x">
          <strong>
            {t("claims:claimsoverview.procedureCodeDescription")}
          </strong>
        </div>
        <div className="columns small-12">
          <p>{list.serviceType}</p>
        </div>
      </div>
      <h2 className="hl-small">
        {t("claims:claimsoverview.billingdetails")}
      </h2>
      <div className="row">
        <div className="small-12 medium-4 columns">
          <PieChart data={reformedList} height={200} width={250} cutoutPercentage={0} legendLabels={[t("claims:claimsoverview.memberResponsibility"), t("claims:claimsoverview.floridaBluePaid")]} colorRefClassName={"claimsColorRef"} />
        </div>
        <div className="small-12 medium-8 columns top-1x">
          <div className="row">
            <div className="columns small-12 large-6 padding-right-3x">
              <div className="row">
                <div className="columns small-7">
                  {t("claims:claimsoverview.providerBilled")}
                </div>
                <div className="columns small-5 text-right">
                  {priceUSDFormat(list.providerBilled)}
                </div>
              </div>
              <div className="border-bottom top-1x bottom-1x" />
              <div className="row">
                <div className="columns small-7">
                  {t("claims:claimsoverview.memberDiscount")}
                </div>
                <div className="columns small-5 text-right">
                  {priceUSDFormat(list.serviceMemberDiscount)}
                </div>
                <div className="columns small-7">
                  {t("claims:claimsoverview.floridaBluePaid")}
                </div>
                <div className="columns small-5 text-right">
                  {priceUSDFormat(list.serviceFloridaBluePaid)}
                </div>
              </div>
              <div className="border-bottom top-1x bottom-1x" />
              <div className="row">
                <strong className="columns small-7">
                  {t("claims:claimsoverview.memberResponsibility")}
                </strong>
                <div className="columns small-5 text-right">
                  {priceUSDFormat(list.serviceMemberResponsibility)}
                </div>
              </div>
            </div>
            <MediaQuery minDeviceWidth={640}>
              {matches => {
                if (matches) {
                  return this.renderBreakdown(list, breakdown, "left");
                } else {
                  return this.renderBreakdown(list, breakdown, "top");
                }
              }}
            </MediaQuery>
            <div className="columns small-12 large-2" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="columns small-12 top-1x">
          <strong>{t("claims:claimsoverview.remarks")}</strong>
        </div>
        <div className="columns small-12">
          <p>{list.serviceRemarks}</p>
        </div>
      </div>
    </div>;
  };

  renderDesktop = (t, overViewData, isFetching) => {
    return (
      <div className="row">
        {overViewData &&
          <div className="small-12 columns">
            <h1>{t("claims:claimsoverview.claimDetails")}</h1>
            <div className="row">
              <div className="small-6 columns">
                <Link to={links.CLAIMS} className="button naked">
                  <span aria-hidden="true" className="icon icon-arrow-left" />
                  <span>{t("claims:claimsoverview.backtoclaims")}</span>
                </Link>
              </div>
              <div className="small-6 columns text-right">
                <a href="#" className="secondary padding-right-2x">
                  {t("claims:claimsoverview.question")}
                </a>
                <Link
                  to={links.APPEALCLAIM}
                  className="secondary padding-right-2x"
                >
                  {t("claims:claimsoverview.appeal")}
                </Link>
                <button
                  class="linklike secondary hide-for-small-only collapse"
                  onClick={window.print}
                >
                  <span class="icon icon-print" aria-hidden="true" />
                  <span>{t("common:button.print")}</span>
                </button>
              </div>
            </div>
            <Loader isFetching={isFetching}>
              <div className="row" data-equalizer>
                <div className="small-12 medium-5 large-5 columns">
                  {this.renderOverviewDetails(t, overViewData)}
                </div>
                <div className="small-12 medium-7 large-7 columns">
                  {this.renderBillingDetails(t, overViewData)}
                </div>
              </div>
              {this.renderSavingAlert(t)}
              {this.renderServiceDetails(t, overViewData)}
            </Loader>
          </div>
        }
      </div>
    );
  };

  renderMobile = (t, overViewData, isFetching) => {
    let tsChoices = [];
    if (overViewData) {
      tsChoices = [
        {
          name: t("claims:claimsoverview.overview"),
          children: (
            <div className="row">
              <div className="columns">{this.renderOverviewDetails(t, overViewData)}</div>
              <div className="columns">{this.renderBillingDetails(t, overViewData)}</div>
              <div className="columns">{this.renderSavingAlert(t)}</div>
            </div>
          ),
        },
        {
          name: t("claims:claimsoverview.services"),
          children: this.renderServiceDetails(t, overViewData)
        },
      ];
    }
    return (
      <Fragment>
        <div className="row bottom-1x">
          <div className="columns small-4">
            <Link to={links.CLAIMS} className="button naked">
              <span aria-hidden="true" className="icon icon-chevron-left" />
              <span>{t("claims:claimsoverview.back")}</span>
            </Link>
          </div>
          <div className="columns small-8">
            <strong>{t("claims:claimsoverview.claimDetails")}</strong>
          </div>
        </div>
        <Loader isFetching={isFetching}>
          <UITabSwitcher
            choices={tsChoices}
            className="text-center mobile-tab-switcher"
            name="claimDetails"
          />
        </Loader>
      </Fragment>
    );
  };

  render() {
    const { t } = this.props;
    let overViewData = this.props.data.get(OverviewConstants.PROP_CLAIM_OVERVIEW_DATA);
    let isFetching = this.props.data.get(GlobalConstants.PROP_FETCHING)
    return (
      <MediaQuery minDeviceWidth={640}>
        {matches => {
          if (matches) {
            return this.renderDesktop(t, overViewData, isFetching);
          } else {
            return this.renderMobile(t, overViewData, isFetching);
          }
        }}
      </MediaQuery>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.ClaimOverviewReducer
  };
}

export default connect(mapStateToProps)(ClaimDetail);
