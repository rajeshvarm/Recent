import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import MediaQuery from "react-responsive";
import Chart from "./Chart";

import UIAccordion from "UI/UIAccordion";
import UITabSwitcher from 'UI/UITabSwitcher';
import * as links from "constants/routes";
import * as Actions from "../actions";
import { priceUSDFormat } from "modules/Utility";

@translate(["common", "claims"])
class ClaimsOverview extends Component {
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

  renderOverviewDetails = () => {
    let claimsData = this.props.data.claimOverviewData.Response.claimDetails;
    const { t } = this.props;
    return (
      <Fragment>
        <div className="panel standard">
          <div className="row head">
            <div className="columns small-12">
              <h1 className="hl-medium">
                {t("claims:claimsoverview.overview")}
              </h1>
            </div>
          </div>
          <div className="row body">
            <div className="columns small-12">
              {this.renderOverview(claimsData)}
              <div className="top-1x">
                <strong>{t("claims:claimsoverview.description")}</strong>
              </div>
              <p>Occum aut dolo cusam alicius et etus rehendi rerera nem hicimus,etus, there is a charcter limit of 200</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  renderOverview = () => {
    let claimsData = this.props.data.claimOverviewData.Response.claimDetails;
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
            <div className="row overview-panel">
              <strong className="columns small-5">{item.label}</strong>
              <div className="columns small-7 text-right padding-right-1x">
                {claimsData[item.key]}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderBillingDetails = (list) => {
    const breakdown = [
      { label: "Deductible:", key: "deductibleAmount" },
      { label: "Co-Payment:", key: "copaymentAmount" },
      { label: "Co-Insurance:", key: "coinsuranceAmount" },
      { label: "Not Covered:", key: "" }
    ];
    let claimsData = list.Response.ClaimPaid;
    let overView = list.Response.Services;
    const { t } = this.props;
    return (
      <div className="panel standard">
        <div className="row head">
          <div className="columns small-12">
            <h1 className="hl-medium">
              {t("claims:claimsoverview.billingdetails")}
            </h1>
          </div>
        </div>
        <div className="row body">
          <div className="columns small-12 medium-12 large-5 text-center">
            {list.Response && list && (
              <Chart
                data={list.Response.ClaimPaid}
                height={200}
                width={250}
                cutoutPercentage={0}
                axisLabel={["Member Responsibility", "Florida Blue Paid"]}
                axisKey={[
                  "totalMemberResponsibility",
                  "serviceFloridaBluePaid"
                ]}
              />
            )}
          </div>
          <div className="columns small-12 medium-12 large-7">
            <div className="row">
              <div className="columns small-12">
                <div className="row">
                  <div className="columns small-7">
                    {t("claims:claimsoverview.providerBilled")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.providerBilled)}
                  </div>
                </div>
                <div className="border-bottom" />
                <div className="row">
                  <div className="columns small-7">
                    {t("claims:claimsoverview.memberDiscount")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.serviceMemberDiscount)}
                  </div>
                  <div className="columns small-7">
                    {t("claims:claimsoverview.floridaBluePaid")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.serviceFloridaBluePaid)}
                  </div>
                </div>
                <div className="border-bottom" />
                <div className="row">
                  <strong className="columns small-7">
                    {t("claims:claimsoverview.memberResponsibility")}
                  </strong>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(claimsData.totalMemberResponsibility)}
                  </div>
                </div>
              </div>
            </div>
            <div className="pricebreakup">
              {breakdown.map((item, index) => {
                return (
                  <div className="row">
                    <div className="columns small-6">{item.label}</div>
                    <div className="columns small-6 text-right">
                      {priceUSDFormat(overView[item.key])}
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
    return(
    <div className="row">
      <div className="small-12 columns">
        <div className="panel standard">
          <div className="row">
            <div className="columns small-12 medium-5 large-5">
              <div className="row head">
                <div className="columns">
                  <h1 className="hl-medium">Congrats!</h1>
                </div>
              </div>
              <div className="row body">
                <div className="columns">
                  <p>You saved $250 by choosing generic over brand</p>
                </div>
              </div>
            </div>
            <div className="columns small-12 medium-7 medium-7 border">
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

  renderServiceDetails = () => {
    const { t } = this.props;
    let serviceViewData = this.props.data.claimOverviewData.Response.Services;
    let openAccoridon = this.state.toggleAccordion ? serviceViewData.length : 0;
    return (
      <div className="row">
        <div className="small-12 columns">
          <div className="panel standard">
            <div className="row head">
              <div className="columns small-8 medium-6">
                <h1 className="hl-medium">
                  {t("claims:claimsoverview.servicesunderclaim")}
                </h1>
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
                  className="accordion"
                  openAllNPanels={openAccoridon}
                  allowManyPanelsToBeOpen={true}
                >
                  {this.renderAccordion()}
                </UIAccordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderAccordion = () => {
    let overViewData = this.props.data.claimOverviewData.Response.Services;
    const accordionContent = [];
    overViewData.forEach((list, index) => {
      accordionContent.push({
        ariaLabel: list.serviceProvider,
        header: this.renderAccordionHeader(list),
        body: this.renderAccordionBody(list)
      });
    });
    return accordionContent;
  };

  renderAccordionHeader = (list) => {
    return <div>{list.claimServiceDate}</div>;
  };

  renderAccordionBody = (list) => {
    const { t } = this.props;
    const breakdown = [
      { label: "Deductible:", key: "deductibleAmount" },
      { label: "Co-Payment:", key: "copaymentAmount" },
      { label: "Co-Insurance:", key: "coinsuranceAmount" },
      { label: "Not Covered:", key: "serviceNetAmountCharge" }
    ];
    return (
      <div>
        <strong>October 2,2018 to October 4,2018</strong>
        <div className="row top-1x">
          <div className="columns small-12">
            <strong>{t("claims:claimsoverview.procedureCode")}</strong>
          </div>
          <div className="columns small-12">
            <p>FX22333</p>
          </div>
          <div className="columns small-12 top-1x">
            <strong>
              {t("claims:claimsoverview.procedureCodeDescription")}
            </strong>
          </div>
          <div className="columns small-12">
            <p>Office visit</p>
          </div>
        </div>
        <h1 className="hl-small">
          {t("claims:claimsoverview.billingdetails")}
        </h1>
        <div className="row">
          <div className="small-12 medium-4 columns">
            <Chart
              data={list}
              height={200}
              width={250}
              cutoutPercentage={0}
              axisLabel={["Member Responsibility", "Florida Blue Paid"]}
              axisKey={[
                "serviceMemberResponsibility",
                "serviceFloridaBluePaid"
              ]}
            />
          </div>
          <div className="small-12 medium-4 columns top-1x">
            <div className="row">
              <div className="columns small-12">
                <div className="row">
                  <div className="columns small-7">
                    {t("claims:claimsoverview.providerBilled")}
                  </div>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(list.providerBilled)}
                  </div>
                </div>
                <div className="border-bottom" />
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
                <div className="border-bottom" />
                <div className="row">
                  <strong className="columns small-7">
                    {t("claims:claimsoverview.memberResponsibility")}
                  </strong>
                  <div className="columns small-5 text-right">
                    {priceUSDFormat(list.serviceMemberResponsibility)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="small-12 medium-4 columns">
            <div className="row">
              <div className="columns small-12 accordion-pricebreakup margin-pricebreakup">
                {breakdown.map((item, index) => {
                  return (
                    <div className="row">
                      <div className="columns small-7">{item.label}</div>
                      <div className="columns small-5 text-right">
                        {priceUSDFormat(list[item.key])}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="columns small-12">
            <strong>{t("claims:claimsoverview.remarks")}</strong>
          </div>
          <div className="columns small-12">
            <p>{list.serviceRemarks}</p>
          </div>
        </div>
      </div>
    );
  };

  renderDesktop = () => {
    const { t } = this.props;
    let overViewData = this.props.data.claimOverviewData;
    let queryString = {}; 
    this.props.location.search.substring(1).replace(/([^=&]+)=([^&]*)/g, 
    (m, key, value) => queryString[decodeURIComponent(key)] = decodeURIComponent(value)); 
    return (
      <div className="row">
        {overViewData.Response && 
          <div className="small-12 columns">
            <h1 className="hl-xlarge">
              {t("claims:claimsoverview.claimDetails")}
            </h1>
            <div className="row">
              <div className="small-6 columns">
                <Link to={links.CLAIMS} className="button naked">
                  <span aria-hidden="true" className="icon icon-arrow-left" />
                  <span>{t("claims:claimsoverview.backtoclaims")}</span>
                </Link>
              </div>
              <div className="small-6 columns text-right">
                <a href="#" className="promo6 padding-right-3x">
                  {t("claims:claimsoverview.question")}
                </a>
                <Link
                  to={links.APPEALCLAIM}
                  className="promo6 padding-right-3x"
                >
                  {t("claims:claimsoverview.appeal")}
                </Link>
                <button
                  class="print-button claims-print-button hide-for-small-only"
                  onClick={window.print}
                >
                  <span class="icon icon-print" aria-hidden="true" />
                  <span>{t("common:button.print")}</span>
                </button>
              </div>
            </div>
            <div className="row top-1x" data-equalizer>
              <div className="small-12 medium-5 large-5 columns">
                {this.renderOverviewDetails(t)}
              </div>
              <div className="small-12 medium-7 large-7 columns">
                {this.renderBillingDetails(overViewData)}
              </div>
            </div>  
            {this.renderSavingAlert()}
            {this.renderServiceDetails(t)}
          </div>
        }
      </div>
    );
  };

  renderMobile = () => {
    const { t } = this.props;
    let overViewData = this.props.data.claimOverviewData;
    const tsChoices = [
      {
        name: t("claims:claimsoverview.overview"),
        children: (
          <div className="row">
            <div className="columns">{this.renderOverviewDetails(t)}</div>
            <div className="columns">{this.renderBillingDetails(overViewData)}</div>
            <div className="columns">{this.renderSavingAlert(t)}</div>
          </div>
        ),
      },
      {
        name: t("claims:claimsoverview.services"),
        children: this.renderServiceDetails(t)
      },
    ];
    return (
      <Fragment>
          <div className="row bottom-1x">
            <div className="columns small-4">
              <Link to={links.CLAIMS} className="button naked">
                <span aria-hidden="true" className="icon icon-chevron-left back-button" />
                <span>{t("claims:claimsoverview.back")}</span>
              </Link>
            </div>
            <div className="columns small-8">
              <strong>{t("claims:claimsoverview.claimDetails")}</strong>
            </div>
            </div>
              <UITabSwitcher
                choices={tsChoices}
                className="text-center"
                name="claimDetails"
              />
      </Fragment>
    );
  };

  render() {
    const { t } = this.props;
    return (
      <MediaQuery minDeviceWidth={640}>
        {matches => {
          if (matches) {
            return this.renderDesktop(t);
          } else {
            return this.renderMobile(t);
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

export default connect(mapStateToProps)(ClaimsOverview);
