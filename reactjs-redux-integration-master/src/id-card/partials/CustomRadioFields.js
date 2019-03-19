import React, {Component, Fragment} from 'react';

import * as AccountConstants from 'constants/account';

const addressTypes = {
  'Mailing': AccountConstants.MAILING_ADDRESS, 
  'Alternate': AccountConstants.ALTERNATE_ADDRESS, 
  'Billing': AccountConstants.BILLING_ADDRESS
};

class CustomRadioFields extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};

    state['value'] = props.defaultValue;

    return state;
  }

  handleUpdate = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      'value': value
    }, () => {
      this.dispatchChoiceEvent(name, value);
    });
  }

  dispatchChoiceEvent = (name, value) => {
    if(this.props.onValidateChange) {
      this.props.onValidateChange(name, value);
    }
  }
  
  renderRadioButton = (label, addressLabel, value, checked = false) => {
    const {name} = this.props;

    return (
      <Fragment>
        <div className="columns large-4 medium-4 padding-1x text-left">
          <label className="collapse">
            <input type="radio" name={name} value={value} className="collapse inline" checked={checked} onChange={this.handleUpdate} />
            <span>{label}</span>
          </label>
          <div className="padding-left-5x">
            {addressLabel}
          </div>
        </div>
        <div className="columns large-8 medium-8" />
      </Fragment>
    );
  };

  getFullAddress = (address) => {
    return(
      <Fragment>
        <p className="collapse">{address[AccountConstants.ADDRESS_LINE_1]}</p>
        <p className="collapse">{address[AccountConstants.ADDRESS_LINE_2]}</p>
        <p className="collapse">{address[AccountConstants.CITY]}, {address[AccountConstants.STATE]} {address[AccountConstants.ZIP_CODE]}</p>
      </Fragment>
    );
  }

  render() {
    const {t, choices, name} = this.props;

    return (
      <Fragment>
        {
          Object.keys(addressTypes).map((addressType) => {
            const address = choices.filter((choice) => choice.type === addressTypes[addressType] && choice);
            const addressLabel = address.length ? this.getFullAddress(address[0]) : '';
            const label = t(`idcard:${addressType}`);
            const value = addressTypes[addressType];
            const checked = this.state['value'] === value;

            return (
              <fieldset key={`${name}-${addressType}`}>
                <div className="row padding-1x padding-bottom-1x">
                  {this.renderRadioButton(label, addressLabel, value, checked)}
                </div>
              </fieldset>
            );
          })
        }
      </Fragment>
    );
  }
}

export default CustomRadioFields;