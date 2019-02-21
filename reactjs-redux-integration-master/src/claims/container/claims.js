import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { translate } from "react-i18next";
import { connect } from 'react-redux';
import v4 from "uuid/v4";

import { resetDocumentKeyboardFocus, confirmConstraints } from 'ui-utilities';
import { getClaimsDownloadChoices, getClaimsFileTypeChoices } from 'modules/ChoicesHelper';
import { getRequiredField } from 'modules/ConstraintHelper';

import UIRadioSelection from 'UI/UIRadioSelection';
import UIModal from 'UI/UIModal';
import Loader from 'components/Loader';
import UITable from "components/UITable";
import Filters from "components/filters/containers/Filters";
import UIAlert from "UI/UIAlert";
import UIDropDown from "UI/UIDropDown";
import simpleDDState from "UI/modules/DDState";
import SearchBar from "components/SearchBar";
import { ALERTS } from "UI/modules/Enumerations";

import * as links from 'constants/routes';
import * as Actions from '../actions';
import * as Constants from 'constants/claims';
import * as GlobalConstants from 'constants/global';



@translate(["common", 'claims'])
class Claims extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);

    //initialize class-level variables here for efficiency
    this.claimsModalStepOneConstraints = {[Constants.FIELD_DOWNLOAD_CLAIMS_RANGE]: getRequiredField(this.props.t)};
    this.claimsModalStepTwoConstraints = {[Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE]: getRequiredField(this.props.t)};
    this.claimsFileTypeChoices = getClaimsFileTypeChoices(this.props.t);
    this.uuid = v4();
    this.uuid2 = v4();
  };

  ingressDataTransform = (props) => {
    let state = {
      searchResults: [],
      downloadClaimsModalVisibility: false,
      modalStepNumber: 1,
      ddState: simpleDDState("savingsAlert", true, null)
    };
    return state;
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchClaims({range:[0, 9]}));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ searchResults: nextProps.data.get(Constants.PROP_FILTERED_DATA) })
  }

  filterData = (request) => {
    this.props.dispatch(Actions.fetchClaims(request));
  }

  closeNotification = () => {
    this.props.dispatch(Actions.closeNotification())
  }

  toggleDataList = () => {
    let request = this.props.data.get(Constants.PROP_FILTERS);
    request.range[1] = request.range[1] + 10;
    this.props.dispatch(Actions.fetchClaims(request));
  }

  searchList = ($event) => {
    let updatedList = this.props.data.get(Constants.PROP_FILTERED_DATA);
    updatedList = updatedList.filter(item => {
      return (Object.keys(item).some(key => item[key].toString().toLowerCase().includes($event.target.value.toLowerCase())))
    });
    this.setState({ searchResults: updatedList });
  }

  update = (key, value) => {
    console.log("@@@ UPDATE; key,value",key,value)
    this.setState({[key]: value});
  }

  getErrorMessage = (field, errors) => {
    console.log("FIELD IS: ", field, "\nWHILE ERRORS ARE: ", errors)
    if (errors) {
      let messages = [];
      if (Array.isArray(field)) {
        field.map(function(v, index) {
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
  };

  toggleDownloadClaimsModalVisibility = () => {
    this.setState(prevState => {
      //if modal is open, close it and reset:
      //-state.modalStepNumber that determines the content rendered on modal close
      //-radio button groups' state
      //-UI validation errors
      if (prevState.downloadClaimsModalVisibility) {
        return {
          downloadClaimsModalVisibility: !prevState.downloadClaimsModalVisibility,
          modalStepNumber: 1,
          error: null,
          [Constants.FIELD_DOWNLOAD_CLAIMS_RANGE]: null,
          [Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE]: null
        }
      }
      //update the claims choices to be used in the radio button group that's part of the download claims modal
      /* TO-DO: THESE DATES SHOULD BE DYNAMICALLY DETERMINED BASED ON CURRENT CLAIMS FILTERS! */
      this.claimsDownloadChoices = getClaimsDownloadChoices(this.props.t, '10/22/2019', '10/22/2015');
      return { downloadClaimsModalVisibility: !prevState.downloadClaimsModalVisibility };
    });
  }

  resetDownloadClaimsModalToStepOne = () => {
    this.setState({
      error: null,
      [Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE]: null,
      modalStepNumber: 1
    });
  }

  /* click handler for the download claims modal's step one "Next" button */
  handleClaimsModalNext = () => {
    const validationErrors = confirmConstraints(this.state, this.claimsModalStepOneConstraints);

    if (validationErrors) {
      this.setState({error: validationErrors}, ()=>{
        window.scrollTo(0,0);
        resetDocumentKeyboardFocus();
      });
    } else {
      this.setState({modalStepNumber: 2, error: null});
    }
  }

  /* click handler for the download claims modal's step two "Download" button */
  handleClaimsModalDownload = claimsType => {
    const validationErrors = confirmConstraints(this.state, this.claimsModalStepTwoConstraints);

    if (validationErrors) {
      this.setState({error: validationErrors}, ()=>{
        window.scrollTo(0,0);
        resetDocumentKeyboardFocus();
      });
    } else {
      const fileType = this.state[Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE];
      this.setState({
        downloadClaimsModalVisibility: false,
        modalStepNumber: 1,
        error: null,
        [Constants.FIELD_DOWNLOAD_CLAIMS_RANGE]: null,
        [Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE]: null,
      }, ()=>{
        //initiate download for the specific claims list requested
        window.open(fileType == 'csv'
          ? './data/Fake_CSV.csv'
          : './data/Fake_PDF.pdf');
      })
    }
  }

  /* Take the translator and return the content for either step-1 or step-2 of the claims download
     modal based on state */
  getDownloadClaimsModalContent = t => (
    <UIModal
      dialogClasses=""
      visible={this.state.downloadClaimsModalVisibility}
      onExit={this.toggleDownloadClaimsModalVisibility}
    >
      <div class="row head">
        <div class="columns small-11">
          <h2 class="hl-large"><span class="icon icon-external-link padding-right-1x" aria-hidden="true" />Export</h2>
        </div>
        <div class="columns small-1">
          <button aria-label="close dialog" title="close dialog" class="close" onClick={this.props.toggleDownloadClaimsModalVisibility} />
        </div>
      </div>


        { this.state.modalStepNumber == 1
          ? this.getDownloadClaimsModalStepOneContent(t)
          : this.getDownloadClaimsModalStepTwoContent(t) }
    </UIModal>
  );

  getDownloadClaimsModalStepOneContent = t => (
    <Fragment>
      <div class="row body modal-padding">
        <div class="columns small-12 collapse">
          <h3 class="hl-medium">{t("claims:downloadModal.step") + this.state.modalStepNumber + t("claims:downloadModal.of2")}</h3>
          <p>{t("claims:downloadModal.subheader1")}</p>

          <div class="mlp-radio-buttons bottom-3x">
            <UIRadioSelection
              layout='COLUMN0'
              required={true}
              label=""
              name={Constants.FIELD_DOWNLOAD_CLAIMS_RANGE}
              inline={false}
              defaultValue={this.state[Constants.FIELD_DOWNLOAD_CLAIMS_RANGE]}
              choices={this.claimsDownloadChoices}
              onValidatedChange={this.update}
              errorMessage={this.getErrorMessage(Constants.FIELD_DOWNLOAD_CLAIMS_RANGE, this.state.error)} />
          </div>
        </div>
      </div>

      <div class="row footer">
        <div class="columns small-6 medium-3 large-3">
          <button onClick={this.toggleDownloadClaimsModalVisibility} class="secondary core2 expand">{t("button.close")}</button>
        </div>
        <div class="columns small-6 medium-3 large-3 medium-offset-6 large-offset-6 text-right">
          <button onClick={this.handleClaimsModalNext} class="primary core2 expand">{t("button.next")}</button>
        </div>
      </div>
    </Fragment>
  )

  getDownloadClaimsModalStepTwoContent = t => (
    <div>
      <h3 class="hl-medium">{t("claims:downloadModal.step") + this.state.modalStepNumber + t("claims:downloadModal.of2")}</h3>
      <p>{t("claims:downloadModal.subheader2")}</p>

      <div class="mlp-radio-buttons bottom-3x">
        <UIRadioSelection
          layout='COLUMN0'
          required={true}
          label=""
          name={Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE}
          inline={false}
          defaultValue={this.state[Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE]}
          choices={this.claimsFileTypeChoices}
          onValidatedChange={this.update}
          errorMessage={this.getErrorMessage(Constants.FIELD_DOWNLOAD_CLAIMS_FILE_TYPE, this.state.error)} />
      </div>

      <div class="columns small-6 text-center">
        <button onClick={this.resetDownloadClaimsModalToStepOne} class="secondary">{t("button.back")}</button>
      </div>
      <div class="columns small-6 text-center">
        <button onClick={this.handleClaimsModalDownload} class="primary core2">{t("button.download")}</button>
      </div>
    </div>
  )

  toggleDropVisibility = (a, b, c) => {
    let newState = this.state.ddState.update(a, b, c);
    if (newState) {
      this.setState({ ddState: newState });
    }
  };

  /// @@@@@@@@ RENDERS ....................

  render() {
    let filters = this.props.data.get(Constants.PROP_FILTERS)
    const { t } = this.props;
    const filterOptions = [
      {
        label: "Plan Year",
        key: "planYear",
      },
      {
        label: "Plan Type",
        key: "planType",
      },
      {
        label: "Providers",
        key: "providers",
      }

  ]
    const columns = [
      {
        label: t('claims:table.facilityprovider'),
        name: "Facility Provider",
        key: "facility",
        sort: true
      },
      {
        label: t('claims:table.service'),
        name: "Service",
        key: "service",
        sort: true,
        type: 'date'
      },
      {
        label: t('claims:table.type'),
        name: "Type",
        key: "type",
        sort: true
      },
      {
        label: t('claims:table.status'),
        name: "Status",
        key: "status",
        sort: true,
        columnClass: 'text-center'
      },
      {
        label: t('claims:table.charge'),
        name: "Claim Charge",
        key: "claimCharge",
        sort: true,
        columnClass: 'text-right'
      },
      {
        label: t('claims:table.cost'),
        name: "Your Cost",
        key: "yourCost",
        sort: true,
        columnClass: 'text-right'
      }
    ]
    const ariaLabelKey = ['facilityprovider', 'receiveddate'];
    const notification = { title: "Close savings message", ariaLabel: "Close savings message", onClose: this.closeNotification }
    const filteredDataLength = this.state.searchResults.length;
    const isLoaded = this.props.data.get(Constants.PROP_ISLOADED);
    return (
      <Fragment>
      {!this.props.data.get(GlobalConstants.PROP_ERROR) ?
        (<Fragment> 
          {this.props.data.get(Constants.PROP_TOTAL_COUNT) > 0 ? 
      (<Fragment>
        <div class="row">
          <div class="small-12 medium-4 columns">
            <h1>{t("claims:claims")}</h1>
          </div>
          <div class="hide-for-small-only hide-for-print medium-8 columns text-right top-2x">
            <button
              aria-haspopup="dialog"
              class="linklike secondary"
              onClick={this.toggleDownloadClaimsModalVisibility}
            >
              <span class="icon icon-external-link" aria-hidden="true" /><span>{t("common:button.export")}</span>
            </button>
            <button
              class="linklike secondary padding-left-2x"
              onClick={window.print}
            >
              <span class="icon icon-print" aria-hidden="true" /><span>{t("common:button.print")}</span>
            </button>
          </div>
        </div>
        {/*this.props.data.filteredData.some((list) => list.savedCost) &&
          !this.props.data.hideNotify &&*/
          /*<UIAlert
            alertType={ALERTS.NOTIFICATION}
            alertTagline={t('claims:alerttitle')}
            icon="icon circledIconColored icon-money-fill-circle"
            closeButton={notification}
            class="event notification naked"
          >
            <span class="padding-left-1x">Next time save <strong>$850</strong> by choosing Urgent Care</span>
            <a href="#" class="secondary float-right" aria-label="Learn more about savings">{t('claims:learnmore')}</a>
          </UIAlert>*/
            <UIDropDown
              ddId="savingsAlert"
              class="notification note hide-for-print bottom-1x"
              ddState={this.state.ddState}
              closeButton={{buttonAction: true, class: "close naked", icon: "icon-close"}}
              buttonAction={this.toggleDropVisibility}
              children={
                <div class="row">
                  <div class="columns small-2 medium-1 large-1 text-center">
                    <span aria-hidden="true" class="icon-3x icon-money-fill-circle positive"></span>
                  </div>
                  <div class="columns small-10 medium-11 large-11 top-1x">
                    <div class="row">
                      <div class="columns small-12 medium-9 large-9">
                        <span>Next time save <strong>$850</strong> by choosing Urgent Care</span>
                      </div>
                      <div class="columns small-12 medium-3 large-3 medium-text-center large-text-center">
                        <a href="#" class="secondary" aria-label="Learn more about savings">{t('claims:learnmore')}</a>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
        }
        <div class="row top-1x hide-for-print">
          <div class="columns small-3">
            <Link class="button naked mobile-view hide-for-print" to={links.HEALTHINSURANCE}>
              <span aria-hidden="true" class="icon-chevron-left" />{t('claims:back')}
            </Link>
          </div>
          <div class="columns small-9 medium-3 large-3">
            <Filters
              toggleFilters={this.toggleFilters}
              filterAriaControl={this.filterAriaControl}
              filterChange={this.filterData}
              filterMaxCount={4}
              filterOptions={filterOptions}
              showMoreKey={['providers']}
            />
          </div>
          <div class="columns small-12 medium-6 large-6">
            <SearchBar
              placeholder="Search My Content"
              ariaLabel="search claims"
              ariaControls={`${this.uuid} ${this.uuid2}`}
              onValidatedChange={this.searchList}
            />
          </div>
          <div className="desktop-view columns small-12 medium -3 large-3 top-1x text-right" id={this.uuid} aria-live="polite">
            {`${t('table:table.displaying')} ${filteredDataLength}/${this.props.data.get(Constants.PROP_TOTAL_COUNT)} ${t('table:table.claims')}`}
          </div>
        </div>
        <Loader isFetching={this.props.data.get(GlobalConstants.PROP_FETCHING)}>
          <UITable
            data={this.state.searchResults}
            headers={columns}
            name={t("claims:claims")}
            sortable={true}
            pageLink={links.CLAIMDETAIL}
            providerRowDisplay='facilityprovider'
            uniqueKey="claimId"
            showDetails={true}
            isLoaded={isLoaded}
            linkAriaLabelKey={ariaLabelKey}
            filterAriaControl="sidenav claims"
            id={this.uuid2}
          />
           {filters.range && this.props.data.get(Constants.PROP_TOTAL_COUNT) >= filters.range[1] && (
              <div className="row top-1x text-center hide-for-print">
                <div className="columns small-12 ">
                  <button
                    type="button"
                    class="button secondary core2"
                    onClick={this.toggleDataList}
                    aria-label="View more Claims"
                  >
                    {t('table:table.viewmore')}
                  </button>
                </div>
              </div>
             )}
        </Loader>

        {/* Export/Download Claims Modal Content  */}
        <div aria-live="polite">
          {this.getDownloadClaimsModalContent(t)}
        </div>
      </Fragment>) : <label>No Claims Found</label>
    }
  </Fragment>) : (<label className='text-danger'>Error Fetching Data</label>)
}
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
