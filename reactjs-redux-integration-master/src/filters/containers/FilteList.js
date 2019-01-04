import React, { Component, Fragment } from "react";
import { translate } from "react-i18next";
import UICheckSelection from 'UI/UICheckSelection';
import UIDropDownButton from 'UI//UIDropDownButton';
import { LAYOUTS } from 'UI/modules/Enumerations';

@translate(["common", "table"])
class FilterList extends Component {
    constructor(props) {
    super(props);
    this.state = {
      filterData: this.props.filteredData,
      toggleList: true
    };
  }

  toggleList = () =>  {this.setState({ toggleList: !this.state.toggleList })}
  render() {
	  const {t} = this.props
      let dataList = this.props.dataList;
      let sliceCount = this.state.toggleList ? this.props.filterMaxList : this.props.dataList.data.length;
      return (
			<div className="filter-list">
				<UICheckSelection name='list'
					choices={dataList.data.slice(0, sliceCount)}
					defaultValue={this.props.selectionFilter}
					layout={LAYOUTS.COLUMN1}
					onValidatedChange={(key, label) => this.props.changeFilter(key, label, dataList.id)} />
				{this.props.dataList.data.length > this.props.filterMaxList &&
					<div className="row text-center collapse collapse-padding">
						<div className="columns small-12 top-1x">
							<UIDropDownButton
								buttonAction={this.toggleList}
								type="toggle"
								ddId={this.state.toggleList.toString()}
								label={this.state.toggleList ? t('table:filter.showmore') : t('table:filter.showless')}
								className="naked"
								/>
							</div>
						</div>
					}
				</div>
			)
  }
}
export default FilterList;