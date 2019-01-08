import React, {Component, Fragment} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';

import UIModal from 'UI/UIModal';

import * as IDCardActions from '../actions';

import * as IDCardConstants from 'constants/idcard';

// import CustomRadioFields from '../partials/CustomRadioFields';

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

    props.dispatch(IDCardActions.requestIDCardService());

    return state;
  };

  update = (key, value) => {
    this.setState({
      ...this.state,
      [key]: value,
    });
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
      return {
        ...prevState,
        modalVisible: !prevState.modalVisible,
      }
    });
  };

  getImage = (idCards) => {
    const imgData = idCards.getIn([IDCardConstants.ID_CARDS, 0, IDCardConstants.RESPONSE_BYTES], fromJS([]));
    const imgFront = imgData.get(IDCardConstants.FRONT, '');
    const imgBack = imgData.get(IDCardConstants.BACK, '');

    return [imgFront, imgBack];
  };

  renderAddressModal = (t) => {
    const address = [{}];

    return (
      <UIModal visible={this.state.modalVisible} onExit={this.toggleDialogVisibility}>
        <div className="row head">
          <div className="columns small-11 padding-2x padding-bottom-2x">
            <h2 id="modal-title" className="hl-medium">
              {t('idcard:addressTitleText')}
            </h2>
            <p>{t('idcard:addressSubTitleText')}</p>
          </div>
          <div className="columns small-1">
            <button type="button" aria-label="close-dialog" title="close-dialog" onClick={this.toggleDialogVisibility}>
              <span aria-hidden="true" class="icon icon-2x icon-remove padding-right-2x" />
            </button>
          </div>
        </div>
        <div className="body">
          {/* <CustomRadioFields t={t} name="address" defaultValue={''} choices={address} onValidatedChange={this.update} /> */}
        </div>
        <div className="row footer">
          <div className="columns large-6 medium-6">
            <button className="secondary" onClick={this.toggleDialogVisibility}>
              {t('button.close')}
            </button>
          </div>
          <div className="columns large-6 medium-6 text-right">
            <button className="primary">{t('button.continue')}</button>
          </div>
        </div>
      </UIModal>
    );
  };

  render() {
    const {t} = this.props;
    const imgView = this.state.imgView;

    const [imgFront, imgBack] = this.getImage(this.props.idCardReducer);

    return (
      <Fragment>
        <h1>{t('idcard:title')}</h1>
        <p>{t('idcard:subTitle')}</p>

        {this.renderAddressModal(t)}

        <div className="top-2x">
          <div class="panel id-card">
            <div className="row collapse">
              <div className="columns large-5 medium-5">
                <div className="head text-center">
                  <div className="user inline-block text-left">
                    <div className="icon-2x icon-single text-center" />
                    <p class="collapse top-1x">
                      <strong>Blue Medicare Preferred</strong>
                    </p>
                    <p className="collapse">{t('idcard:memberNumber')} 1XXXXX76</p>
                    <p className="collapse">1/1/2018 {t('idcard:to')} 12/31/2018</p>
                  </div>
                </div>
              </div>
              <div className="body columns large-7 medium-7">
                <div className="row collapse bottom-2x">
                  <div className="columns large-12 medium-12">
                    <div className="options">
                      <div className="icon-text">
                        <span className="icon icon-mail vertical-middle" />
                        <button className="linklike" onClick={this.toggleDialogVisibility}>
                          {t('idcard:requestIdByMail')}
                        </button>
                      </div>
                      <div className="icon-text">
                        <span className="icon icon-download vertical-middle" />
                        <a download="id-card.png" href={`data:application/octet-stream;charset=utf-8;data:image/png;base64,${imgFront}`}>
                          {t('button.download')}
                        </a>
                      </div>
                      <div className="icon-text">
                        <span className="icon icon-print vertical-middle" />
                        <a href="#">{t('button.print')}</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row collapse bottom-1x">
                  <div
                    className={`columns large-12 medium-12 text-center ${
                      imgView === IDCardConstants.FRONT ? '' : 'hide'
                    }`}>
                    <img id="image" src={`data:image/png;base64,${imgFront}`} alt="" />
                  </div>
                  <div
                    className={`columns large-12 medium-12 text-center ${
                      imgView === IDCardConstants.BACK ? '' : 'hide'
                    }`}>
                    <img id="image" src={`data:image/png;base64,${imgBack}`} alt="" />
                  </div>
                </div>
                <div className="row collapse">
                  <div className="columns large-12 medium-12 text-center">
                    <button
                      className={imgView === IDCardConstants.FRONT ? 'primary' : 'secondary'}
                      name="imgView"
                      value={IDCardConstants.FRONT}
                      onClick={this.toggleImgView}>
                      {t('button.front')}
                    </button>
                    <button
                      className={imgView === IDCardConstants.BACK ? 'primary' : 'secondary'}
                      name="imgView"
                      value={IDCardConstants.BACK}
                      onClick={this.toggleImgView}>
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
  }
}

const mapStateToProps = (store) => {
  return {
    idCardReducer: store.IDCardReducer,
  };
};

export default connect(mapStateToProps)(IdCard);