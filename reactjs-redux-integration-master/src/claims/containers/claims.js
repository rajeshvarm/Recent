import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from 'react-redux';

import UIModal from 'UI/UIModal';
import UITable from "components/UITable";
import Filters from "components/filters/containers/Filters";
import NotificationBar from "UI/UINotificationBar";
import SearchBar from "components/SearchBar";

import * as links from 'constants/routes';
import * as Actions from '../actions';


@translate(["common", 'claims'])
class Claims extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
    this.state.downloadClaimsModalVisibility = false;
    this.state.modalStepNumber = 1;
  };

  ingressDataTransform = (props) => {
    let state = {
      searchResults: [],
    };
    return state;
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchClaims({}));
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ searchResults: nextProps.data.filteredData })
  }

  filterData = ( request ) => {
    this.props.dispatch(Actions.fetchClaims(request));
  } 

  closeNotification = () => {
    this.props.dispatch(Actions.closeNotification())
  }

  toggleDataList = () => {
    this.props.dispatch(Actions.toggleList())
  }

  searchList = (event) => {
    let { value } = event.target
    this.setState({ value }, () => {
      let updatedList = this.props.data.filteredData;
      let searchValue = this.state.value.toLowerCase();
      updatedList = updatedList.filter(item => {
        return (Object.keys(item).some(key => item[key].toString().toLowerCase().search(
          searchValue) !== -1))
      });
      this.setState({ searchResults: updatedList });
    })
  };

  toggleDownloadClaimsModalVisibility = () => {
    this.setState(prevState => {
      //reset the modal step number that determines the content rendered on modal close
      if (prevState.downloadClaimsModalVisibility) {
        return {downloadClaimsModalVisibility: !prevState.downloadClaimsModalVisibility, modalStepNumber: 1}
      }
      return {downloadClaimsModalVisibility: !prevState.downloadClaimsModalVisibility};
    });
  }

  /* Take the translator and return the content for either step-1 or step-2 of the claims download
     modal based on state */
  getDownloadClaimsModalContent = t => (
    <UIModal visible={this.state.downloadClaimsModalVisibility} onExit={this.toggleDownloadClaimsModalVisibility}>
      <div className="row head">
        <span class="icon icon-external-link" aria-hidden="true" />
        <h2 id="modal-title">Export</h2>
      </div>
    </UIModal>
  );

  getDownloadClaimsModalStepOneContent = t => {

  }

  getDownloadClaimsModalStepOneContent = t => {

  }

  /// @@@@@@@@ RENDERS ....................

  render() {
    const { t } = this.props;
    const DEFAULTROWDISPLAY = 10;
    const columns = [
      {
        label: t('claims:table.facilityprovider'),
        name: "Facility Provider",
        key: "facility",
        sort: true
      },
      {
        label: t('claims:table.servicedate'),
        name: "Service Date",
        key: "service",
        sort: true
      },
      {
        label: t('claims:table.servicetype'),
        name: "Service Type",
        key: "type",
        sort: true
      },
      {
        label: t('claims:table.status'),
        name: "Status",
        key: "status",
        sort: true
      },
      {
        label: t('claims:table.charge'),
        name: "Claim Charge",
        key: "claimCharge",
        sort: true
      },
      {
        label: t('claims:table.cost'),
        name: "Your Cost",
        key: "yourCost",
        sort: true
      }
    ]
    const ariaLabelKey = ['facilityprovider', 'receiveddate'];

    return (
      <Fragment>
        <div className="row">
          <div className="small-12 medium-4 columns">
            <h1 className="hl-medium">{t("claims:claims")}</h1>
          </div>
          <div className="hide-for-small-only medium-8 columns text-right">
            <button 
              aria-haspopup="dialog"
              class="export-button claims-export-button"
              onClick={this.toggleDownloadClaimsModalVisibility}
            >
              <span class="icon icon-external-link" aria-hidden="true" /><span>{t("common:button.export")}</span>
            </button>
            <button 
              class="print-button claims-print-button left-2x"
              onClick={window.print}
            >
              <span class="icon icon-print" aria-hidden="true" /><span>{t("common:button.print")}</span>
            </button>
          </div>
        </div>
          { this.props.data.filteredData.some((list) => list.savedCost) && 
            !this.props.data.hideNotify &&
            <NotificationBar 
              name="Cost Status" 
              ariaLabel="Savings Alert"
              title={t('claims:alerttitle')}
              onClose={this.closeNotification}
              className="notification-container-inner"
              onClick={this.closeNotification}
              icon="remove"
            >
            {t('claims:learnmore')}
            </NotificationBar>
          }
          <div className="row top-1x">
            <div className="columns small-3">
              <Link className="button naked mobile-view" to={links.HEALTHINSURANCE}>
                <span aria-hidden="true" className="icon-chevron-left" />{t('claims:back')}
              </Link>
              </div>
              <div className="columns small-9 medium-3 large-3">
              <Filters
                filterLimitedIndex="3"
                filterChange={this.onFilterChange}
                filteredData={this.props.data.claimsData}
                filteredDataHeaders={columns}
                toggleFilters={this.toggleFilters}
                filterAriaControl={this.filterAriaControl}
                filterVisibility={true}
                filterChange={this.filterData}
                uniqueKey="claimId"
                filterMaxList={4}
              /> 
            </div>
            <div className="columns small-12 medium-6 large-6">
              <SearchBar 
              SearchBar={this.searchList}
              />
            </div>
          <div className="desktop-view columns small-12 medium -3 large-3 top-1x text-right" aria-describedby={this.props.name}>
            {t('table:table.displaying')} {this.props.data.isLoaded || this.props.data.filteredData.length < DEFAULTROWDISPLAY ?
              this.props.data.filteredData.length : DEFAULTROWDISPLAY}/
                    {this.props.data.filteredData.length} {t('table:table.claims')}
          </div>
          </div>
          <UITable
            data={this.state.searchResults}
            headers={columns}
            defaultRowDisplay={DEFAULTROWDISPLAY}
            name={t("claims:claims")}
            sortable={true}
            pageLink={links.CLAIMSOVERVIEW}
            providerRowDisplay='facilityprovider'
            uniqueKey="claimId"
            showDetails={true}
            isLoaded={this.props.data.isLoaded}
            linkAriaLabelKey={ariaLabelKey}
            filterAriaControl="sidenav claims"
          />
          {!this.props.data.isLoaded &&
        this.props.data.filteredData.length > DEFAULTROWDISPLAY &&  (
          <div className="row top-1x text-center">
          <div className="columns small-12 ">
            <button
              type="button"
              className="button secondary"
              onClick={this.toggleDataList}
              aria-label="View more Claims"
            >
              {t('table:table.viewmore')}
            </button>
          </div>
          </div>
        )}

      {/* Export/Download Claims Modal Content 
      <div aria-live="polite">
        { this.getDownloadClaimsModalContent(t) }
      </div> */}
    </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.ClaimsReducer
  };
}

export default connect(mapStateToProps)(Claims);
