import React, { Component, Fragment } from "react";
import { withRouter } from "react-router";
import { translate } from "react-i18next";


const filterToSet=[];

@translate(["common"])
class SearchBar extends Component {

  render() {
    return (
      <div>
        <input type="text" id="searchBar" placeholder="Search My Content" onChange={this.props.SearchBar}/>
          <span class="icon icon-search-find"></span>
      </div>
    );
  }
}

export default SearchBar;
