import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export class SearchBar extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    ariaControls: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    onValidatedChange: PropTypes.func.isRequired
  };

  //onChange, update upsteam filter
  change = event => {
    this.props.onValidatedChange(event.target.value);
  };

  render() {
    const { ariaControls, placeholder, ariaLabel } = this.props;
    return (
      <div className="search-bar">
        <input
          type="search"
          placeholder={placeholder}
          aria-placeholder={placeholder}
          onChange={this.change}
          aria-controls={this.ariaControls}
        />
        <span className="icon icon-search-find" aria-hidden="true" />
      </div>
    );
  }
}


export default SearchBar;
