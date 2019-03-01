import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export class UISearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    ariaControls: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    onValidatedChange: PropTypes.func.isRequired,
    id: PropTypes.string,
    value: PropTypes.string
  };

  //onChange, update upsteam filter
  change = event => {
    this.props.onValidatedChange(event.target.value);
  };

  render() {
    const { ariaControls, placeholder, ariaLabel, onValidatedChange, ...props } = this.props;
    return (
      <div className="search-bar">
        <input
          type="search"
          placeholder={placeholder}
          aria-placeholder={placeholder}
          onChange={this.change}
          aria-controls={ariaControls}
          {...props}
        />
        <span className="icon icon-search-find" aria-hidden="true" />
      </div>
    );
  }
}

export default UISearchBar;
