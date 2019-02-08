import React, { Component, Fragment } from "react";
import { translate } from "react-i18next";

import UICheckSelection from "UI/UICheckSelection";
import UIAccordion from "UI/UIAccordion";
import Loader from "components/Loader";
import FilterList from "./FilterList";
import * as FilterConstants from "constants/claims";
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as GlobalConstants from 'constants/global';

@translate(['common', 'table'])
class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      isFilters: false,
    };
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchFilters());
  }

  filterListInit = (type = FilterConstants.PROP_INIT) => {
    let filters = { ... this.state.filters };
    let filterData = this.props.data.get(FilterConstants.PROP_FILTER_DATA) && this.props.data.get(FilterConstants.PROP_FILTER_DATA).toJS();
    for (let key in filterData) {
      if (!filters[key] || type === FilterConstants.PROP_CLEAR) {
        filters[key] = [];
      }
    }
    return filters;
  }

  clearSelection = () => {
    this.setState({ filters: this.filterListInit(FilterConstants.PROP_CLEAR) },
      () => {
        this.onFilterChange();
      });
  }

  changeFilter = (name, value, key) => {
    let filters = this.state.filters;
    if (!filters[key]) {
      filters[key] = [];
    }
    if (filters[key].indexOf(value[value.length - 1]) === -1 && value.length) {
      filters[key].push(value[value.length - 1])
    }
    filters[key].forEach((list, index) => {
      if (value.indexOf(list) === -1) {
        filters[key].splice(index, 1)
      }
    });
    this.setState({ filters: filters });
  };

  onFilterChange = () => {
    let filters = { ... this.state.filters }
    if (filters) {
      this.props.filterChange(filters);
    }
  };

  toggleFilters = () => {
    this.setState({ isFilters: !this.state.isFilters });
  };

  listContent = (data, selectionFilter) => {
    return (
      <FilterList
        dataList={data}
        selectionFilter={selectionFilter}
        filterMaxCount={this.props.filterMaxCount}
        showMoreKey={this.props.showMoreKey}
        changeFilter={this.changeFilter}
      />
    )
  }

  renderFilters = (t) => {
    let filters = this.filterListInit();
    const dataFilter = this.props.data.get(FilterConstants.PROP_FILTER_DATA);
    let selectionFilter = [];
    for (let key in filters) {
      filters[key].forEach((list, i) => {
        if (selectionFilter.indexOf(list) === -1) {
          selectionFilter.push(list)
        }
      });
    }
    let filterData = [];
    dataFilter && this.props.filterOptions.forEach((list) => {
        filterData.push({
          'label': `${list.label}`, 'header': `${list.label}`, 'id': `${list.key}`, 'key': `${list.key}`,
          'data': dataFilter.get(list.key).toJS().map((item, index) => {
            return { value: item, label: item, key: list.key }
          })
        })
      })

    filterData.forEach((list, i) => {
      list['body'] = this.listContent(list, selectionFilter)
    });
    let accordion = ( <UIAccordion 
                        className="accordion-filter"
                        openNextPanel={true}
                        allowManyPanelsToBeOpen={true}
                        icon={false}
                        openAllNPanels={4}
                        >
                        {filterData}
                        </UIAccordion>)
    if(this.props.data.get(GlobalConstants.PROP_FETCHING)){
      accordion = <div class="cover"><div class="text-center"></div><div class="loader"></div></div>
    }

    return (
      <div className={this.state.isFilters ? 'active filter-list-content shadow' : 'in-active filter-list-content shadow'}>
        {this.state.isFilters &&
          <div className="padding-top-5x" id="sidenav">
            <div className="vertical-middle" id="closebtn">
              <button className="linklike" onClick={this.clearSelection}>
                {t('table:filter.clear')}
              </button>
              <span aria-hidden="true" aria-expanded={this.state.isFilters}
                onClick={this.toggleFilters} className="icon icon-1x icon-remove padding-left-2x">
              </span>
            </div>
            <h1 className="padding-left-6x">{t('table:filter.filter')}</h1>
            <div className="sidenav-content">
              {accordion}
            </div>
            <div className="row collapse fixed-button padding-2x padding-top-4x">
              <div className="columns small-12 ">
                <button onClick={() => { this.onFilterChange(); this.toggleFilters() }} className="button expand primary core2" >
                  {t('table:filter.applyfilter')}
                </button>
              </div>
              <div className="columns small-12">
                <button aria-expanded={this.state.isFilters} className="button expand secondary core2" onClick={this.toggleFilters} >
                  {t('table:filter.close')}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <button
          className="button primary core2 filter-button"
          onClick={this.toggleFilters}
          aria-controls={this.props.filterAriaControl}
          aria-expanded={this.state.isFilters}
          aria-haspopup="true"
        >
          <span aria-hidden="true" className="icon icon-filter" />
          <span>{t('table:filter.filter')}</span>
        </button>
          {this.renderFilters(t)}
      </Fragment>

    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.FilterReducer
  };
}

export default connect(mapStateToProps)(Filters);
