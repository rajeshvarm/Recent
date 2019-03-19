import React, {Component, Fragment} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import MediaQuery from 'react-responsive';

import {ALERTS} from 'UI/modules/Enumerations';
import UIModal from 'UI/UIModal';
import UITabSwitcher from 'UI/UITabSwitcher';
import UISelectField from 'UI/UISelectField';
import UIAlert from 'UI/UIAlert';
import UILoader from 'UI/UILoader';

import LoaderExtended from 'components/LoaderExtended';

import * as IDCardActions from '../actions';
import * as AccountActions from 'actions/accountDetail';
import * as ServiceActions from 'actions/service';

import * as GlobalConstants from 'constants/global';
import * as IDCardConstants from 'constants/idcard';
import * as AccountConstants from 'constants/account';
import * as Links from 'constants/routes';

import {getAllAddresses, getSelectedAddress} from 'modules/MLPUtilities';

import CustomRadioFields from '../partials/CustomRadioFields';

const modalView = {
  LIST_ADDRESS: 'LIST_ADDRESS',
  CONFIRMATION: 'CONFIRMATION',
};

@translate(['common', 'idcard'])
class IdCard extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};

    state['modalVisible'] = false;
    state['imgView'] = IDCardConstants.FRONT;
    state['modalView'] = modalView['LIST_ADDRESS'];
    state[IDCardConstants.ADDRESS] = AccountConstants.MAILING_ADDRESS;

    return state;
  };

  engressDataTransform = (state, dispatch) => {
    const partyId = window.config[GlobalConstants.PARTY_ID];
    const sourceSystem = window.config[GlobalConstants.SOURCE_SYSTEM];
    const tenantId = 'GuideWell';

    // Service need to make sure the KEY values are consistent.
    const addressType = state[IDCardConstants.ADDRESS].split('Address')[0];

    const url = `/mlp/api/v1/mlpsvc/documents/idCard?partyId=${partyId}&addressType=${addressType}&transactionID=${partyId}&sourceSystem=${sourceSystem}&tenantId=${tenantId}`;
    const method = 'POST';

    dispatch(ServiceActions.requestServiceResponse(url, method, {}));
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.serviceReducer !== prevProps.serviceReducer) {
      const isServiceProcessed = this.props.serviceReducer.get(GlobalConstants.PROP_INITIALIZED);
      const isServiceFailed = this.props.serviceReducer.get(GlobalConstants.PROP_ERROR);
      let serviceResponse = '';

      if (isServiceProcessed) {
        serviceResponse = GlobalConstants.PROP_SUCCESS;
      }

      if (isServiceFailed) {
        serviceResponse = GlobalConstants.PROP_ERROR;
      }

      this.setState({
        modalView: modalView['CONFIRMATION'],
        serviceResponse: serviceResponse,
      });
    }
  };

  update = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleSubmit = () => {
    this.engressDataTransform(this.state, this.props.dispatch);
  };

  toggleImgView = (event) => {
    const key = event.target.name;
    const value = event.target.value;

    // To avoid re-renders on continuous same button clicks by user.
    if (this.state[key] === value) {
      return;
    }

    this.update(key, value);
  };

  toggleDialogVisibility = () => {
    this.setState((prevState) => {
      // Reset State for Modal View
      return {
        [IDCardConstants.ADDRESS]: AccountConstants.MAILING_ADDRESS,
        modalVisible: !prevState.modalVisible,
        modalView: modalView['LIST_ADDRESS'],
      };
    });
  };

  getImage = (idCards) => {
    const imgFront = idCards.getIn([IDCardConstants.DATA, 0, IDCardConstants.FRONT], '');
    const imgBack = idCards.getIn([IDCardConstants.DATA, 0, IDCardConstants.BACK], '');

    return [imgFront, imgBack];
  };

  renderAddress = (t) => {
    const addressess = getAllAddresses(this.props.accountReducer).toJS();

    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11 padding-top-3x">
            <h2 className="hl-large padding-bottom-1x">
              {t('idcard:addressTitleText')}
            </h2>
            <p className="collapse larger-1x">{t('idcard:addressSubTitleText')}</p>
          </div>
          <div className="columns small-1">
            <button type="button" className="close" aria-label={t('labels.closeDialog')} onClick={this.toggleDialogVisibility} />
          </div>
        </div>
        <LoaderExtended
          className="top-5x bottom-5x"
          dispatch={this.props.dispatch}
          action={AccountActions.fetchAccountDetails}
          initialized={this.props.accountReducer.get(GlobalConstants.PROP_INITIALIZED)}
          error={this.props.accountReducer.get(GlobalConstants.PROP_ERROR)}
          requestOnEveryVisit={false}>
          <Fragment>
            <div className="body mlp-radio-buttons">
              <Link to={Links.ACCOUNT}>{t('idcard:clickHereToEditAddress')}</Link>
                <CustomRadioFields
                  t={t}
                  name={IDCardConstants.ADDRESS}
                  defaultValue={AccountConstants.MAILING_ADDRESS}
                  choices={addressess}
                  onValidateChange={this.update}/>
            </div>
            <div className="row footer">
              <div className="columns small-6 medium-3 large-3">
                <button className="secondary core2 expand" onClick={this.toggleDialogVisibility}>
                  {t('button.close')}
                </button>
              </div>
              <div className="columns small-6 medium-3 large-3 medium-offset-6 large-offset-6 text-right">
                <button className="primary core2 expand" onClick={this.handleSubmit}>
                  {t('button.continue')}
                </button>
              </div>
            </div>
          </Fragment>
        </LoaderExtended>
      </Fragment>
    );
  };

  renderSuccessMessage = (t) => {
    const addresses = getAllAddresses(this.props.accountReducer);
    const selectedAddress = getSelectedAddress(addresses, this.state[IDCardConstants.ADDRESS]);

    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11 padding-2x padding-bottom-2x">
            <h2 className="hl-large">
              {t('idcard:successModalTitle')}
            </h2>
          </div>
          <div className="columns small-1">
            <button type="button" className="close" aria-label={t('labels.closeDialog')} onClick={this.toggleDialogVisibility}>
            </button>
          </div>
        </div>
        <div className="body left-8x">
          <p>{t('idcard:successModalText')}</p>
          <p className="collapse">{selectedAddress.get(AccountConstants.ADDRESS_LINE_1, '')}</p>
          <p className="collapse">{selectedAddress.get(AccountConstants.ADDRESS_LINE_2, '')}</p>
          <p className="collapse">
            {selectedAddress.get(AccountConstants.CITY, '')}, {selectedAddress.get(AccountConstants.STATE, '')} {selectedAddress.get(AccountConstants.ZIP_CODE, '')}
          </p>
        </div>
        <div className="row footer">
          <div className="columns small-6 medium-3 large-3 medium-offset-9 large-offset-9 text-right">
            <button className="primary core2 expand" onClick={this.toggleDialogVisibility}>
              {t('button.close')}
            </button>
          </div>
        </div>
      </Fragment>
    );
  };

  renderErrorMessage = (t) => {
    return (
      <Fragment>
        <div className="row head">
          <div className="columns small-11 padding-2x padding-bottom-2x">
            <h2 className="hl-large">
              {t('idcard:errorModalTitle')}
            </h2>
          </div>
          <div className="columns small-1">
            <button type="button" className="close" aria-label={t('labels.closeDialog')} onClick={this.toggleDialogVisibility} />
          </div>
        </div>
        <div className="body left-1x">
          <p>{t('idcard:errorModalText')}</p>
        </div>
        <div className="row footer">
          <div className="columns small-6 medium-3 large-3 medium-offset-9 large-offset-9 text-right">
            <button className="primary core2 expand" onClick={this.toggleDialogVisibility}>
              {t('button.close')}
            </button>
          </div>
        </div>
      </Fragment>
    );
  };

  renderConfirmation = (t) => {
    return (
      <UILoader 
        className="top-5x bottom-5x"
        isFetching={this.state['serviceResponse'] === ''} 
        errorMessage={this.state['serviceResponse'] === GlobalConstants.PROP_ERROR ? this.renderErrorMessage(t) : ''}>{this.renderSuccessMessage(t)}
      </UILoader>
    ); 
  }

  renderAddressModal = (t) => {
    return (
      <UIModal visible={this.state.modalVisible} onExit={this.toggleDialogVisibility}>
        {this.state['modalView'] === modalView['LIST_ADDRESS'] && this.renderAddress(t)}
        {this.state['modalView'] === modalView['CONFIRMATION'] && this.renderConfirmation(t)}
      </UIModal>
    );
  };

  renderDesktop = (t) => {
    const {imgView} = this.state;

    const [imgFront, imgBack] = this.getImage(this.props.idCardReducer);
    const memberNumber = this.props.idCardReducer.getIn([IDCardConstants.DATA, 0, IDCardConstants.MEMBER]);
    const brandName = this.props.idCardReducer.getIn([IDCardConstants.DATA, 0, IDCardConstants.BRAND_NAME]);

    return (
      <Fragment>
        <h1 className="hl-xxlarge hide-for-print">{t('idcard:title')}</h1>
        <p className="sub-title">{t('idcard:subTitle')}</p>
        <div class="panel top-1x id-card print-id-card">
          <div className="row collapse">
            <div className="columns large-4 medium-4 user-plans inner-panel-divider">
              <div>
                <span className="icon stacked icon-user text-center" aria-hidden="true" />
                <p class="collapse top-1x text-left">
                  <strong>{brandName}</strong>
                </p>
                <p className="collapse text-left">{`${t('idcard:memberNumber')} ${memberNumber}`}</p>
                {/* <p className="collapse text-left">1/1/2018 {t('idcard:to')} 12/31/2018</p> */}
              </div>
            </div>
            <div className="id-body columns large-7 medium-7">
              <div className="row collapse top-1x bottom-2x">
                <div className="columns large-12 medium-12 vertical-middle">
                  <div className="right">
                    <div className="left right-1x">
                      <button className="linklike secondary" onClick={this.toggleDialogVisibility}>
                        <span aria-hidden="true" className="icon icon-email-envelope" />
                        <span>{t('idcard:requestIdByMail')}</span>
                      </button>
                    </div>
                    <div className="left right-1x">
                      <a className="icon secondary" download="id-card.png" href={`data:application/octet-stream;charset=utf-8;data:image/png;base64,${imgFront}`}>
                        <span className="icon icon-download" aria-hidden="true" />
                        <span>{t('button.download')}</span>
                      </a>
                    </div>
                    <div className="left right-1x">
                      <button className="linklike secondary" onClick={window.print}>
                        <span aria-hidden="true" className="icon icon-print" />
                        <span>{t('button.print')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row collapse bottom-1x view-id-card">
                <div className={`id-card-front ${imgView === IDCardConstants.FRONT ? '' : 'hide'}`}>
                  <img id="image" src={`data:image/png;base64,${imgFront}`} alt={t('idcard:frontImageAlt')} />
                </div>
                <div className={`id-card-back ${imgView === IDCardConstants.BACK ? '' : 'hide'}`}>
                  <img id="image" src={`data:image/png;base64,${imgBack}`} alt={t('idcard:backImageAlt')} />
                </div>
              </div>
              <div className="row collapse">
                <div className="columns large-12 medium-12 text-center">
                  <div className="btn-group left large-left-4x large-bottom-1x">
                    <button type="button" className={imgView === IDCardConstants.FRONT ? 'btn-group pair-buttons active'
                      : 'btn-group pair-buttons in-active'} name="imgView" value={IDCardConstants.FRONT} onClick={this.toggleImgView}>
                      {t('button.front')}
                    </button>
                    <button type="button" className={imgView === IDCardConstants.BACK ? 'btn-group pair-buttons active' : 'btn-group pair-buttons in-active'} name="imgView" value={IDCardConstants.BACK} onClick={this.toggleImgView}>
                      {t('button.back')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  renderMobile = (t) => {
    const imgView = this.state.imgView;

    const [imgFront, imgBack] = this.getImage(this.props.idCardReducer);

    let plans = [
      {label: 'Blue Medicare Preferred', value: 'H12345'},
      {label: 'Blue Medicare Preferred RX', value: 'H75675'},
      {label: 'Blue Medicare Preferred PPO', value: 'H69879'},
    ];

    return (
      <Fragment>
        <div className="hide-for-print">
          <h1 className="title">{t('idcard:title')}</h1>
          <UISelectField
            label={t('idcard:subTitle')}
            name="selectPlan"
            defaultValue="H12345"
            choices={plans}
            onValidatedChange={this.update}
            required
          />
        </div>

        <div className="row top-1x">
          <div className="columns small-12">
            <div className="panel id-card small">
              <div className="row collapse">
                <div className="columns large-5 medium-5 user-plans">
                  <div className="head">
                    <div className="text-left">
                      <p className="inline-block collapse">
                        <span className="icon icon-id-card vertical-middle" aria-hidden="true" />
                        <span className="vertical-middle">Blue Medicare Preferred</span>
                      </p>
                      <p className="inline-block collapse">{t('idcard:memberNumber')} 1XXXXX76</p>
                      <p className="inline-block collapse">1/1/2018 {t('idcard:to')} 12/31/2018</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row top-1x bottom-1x view-id-card">
          <div
            className={`columns large-12 medium-12 text-center id-card-front ${
              imgView === IDCardConstants.FRONT ? '' : 'hide'
            }`}>
            <img id="image" src={`data:image/png;base64,${imgFront}`} alt="" />
          </div>
          <div
            className={`columns large-12 medium-12 text-center id-card-back ${
              imgView === IDCardConstants.BACK ? '' : 'hide'
            }`}>
            <img id="image" src={`data:image/png;base64,${imgBack}`} alt="" />
          </div>
        </div>

        <div className="row collapse hide-for-print">
          <div className="btn-group small-bottom-1x">
            <button
              type="button"
              className={
                imgView === IDCardConstants.FRONT ? 'btn-group pair-buttons active' : 'btn-group pair-buttons in-active'
              }
              name="imgView"
              value={IDCardConstants.FRONT}
              onClick={this.toggleImgView}>
              {t('button.front')}
            </button>
            <button
              type="button"
              name="imgView"
              value={IDCardConstants.BACK}
              onClick={this.toggleImgView}
              className={
                imgView === IDCardConstants.BACK ? 'btn-group pair-buttons active' : 'btn-group pair-buttons in-active'
              }>
              {t('button.back')}
            </button>
          </div>
        </div>

        <div className="row doc-menu" ref={this.props.forwardRef} tabIndex="-1">
          <div className="columns small-4 options">
            <a
              className="button no-radius"
              download="id-card.png"
              href={`data:application/octet-stream;charset=utf-8;data:image/png;base64,${imgFront}`}>
              <span aria-hidden="true" className="icon icon-file" />
              <span>{t('idcard:viewpdf')}</span>
            </a>
          </div>
          <div className="columns small-4 options">
            <button className="no-radius" onClick={this.toggleDialogVisibility}>
              <span aria-hidden="true" className="icon icon-email-envelope" />
              <span>{t('idcard:requestByMail')}</span>
            </button>
          </div>
          <div className="columns small-4 options">
            <button className="no-radius" onClick={window.print}>
              <span aria-hidden="true" className="icon icon-credit-card" />
              <span>{t('idcard:addwallet')}</span>
            </button>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    const {t} = this.props;

    // const closeButton = {
    //   title: t('idcard:closeNotification'),
    //   ariaLabel: t('idcard:closeNotificationAriaLabel'),
    //   onClose: () => null,
    // };

    return (
      <Fragment>
        {this.renderAddressModal(t)}
        
        {/* Need to display the Alert Bar only when we are getting it from the service. */}
        {/* <div className="row hide-for-print">
          <div className="columns large-12 medium-12 small-12 right">
            <UIAlert
              ariaLabel="Id Card Progress"
              alertType={ALERTS.NOTIFICATION}
              closeButton={closeButton}
              class="alert collapse text-left id-notifaction-header top-1x"
              id="id-card-requested">
              <p>{t('idcard:idcardRequestInProcess')}</p>
            </UIAlert>
          </div>
        </div> */}
        
        <MediaQuery minDeviceWidth={640}>
          {(matches) => {
            if (matches) {
              return this.renderDesktop(t);
            } else {
              return this.renderMobile(t);
            }
          }}
        </MediaQuery>
        
      </Fragment>
    );
  }
}

const _IdCard = (props) => {
  return(
    <LoaderExtended
      className="top-9x bottom-9x"
      dispatch={props.dispatch}
      action={IDCardActions.requestIDCardService}
      initialized={props.idCardReducer.get(GlobalConstants.PROP_INITIALIZED)}
      error={props.idCardReducer.get(GlobalConstants.PROP_ERROR)}
      requestOnEveryVisit={false}>
      <IdCard {...props} />
    </LoaderExtended>
  );
}

const mapStateToProps = (store) => {
  return {
    idCardReducer: store.IDCardReducer,
    accountReducer: store.AccountDetailReducer,
    serviceReducer: store.ServiceReducer,
  };
};

export default connect(mapStateToProps)(_IdCard);
