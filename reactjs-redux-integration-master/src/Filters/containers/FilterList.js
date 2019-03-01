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

	toggleList = () => { this.setState({ toggleList: !this.state.toggleList }) }
	render() {
		const { t } = this.props
		let dataList = this.props.dataList;
		let sliceCount = this.state.toggleList && this.props.showMoreKey.indexOf(this.props.dataList.key) > -1 ?
			this.props.filterMaxCount : this.props.dataList.data.length;
		return (
			<div className="filter-list left-2x">
				<UICheckSelection name='list'
					choices={dataList.data.slice(0, sliceCount)}
					defaultValue={this.props.selectionFilter}
					layout={LAYOUTS.COLUMN1}
					onValidatedChange={(key, label) => this.props.changeFilter(key, label, dataList.id)} />
				{this.props.dataList.data.length > this.props.filterMaxCount &&
					this.props.showMoreKey.indexOf(this.props.dataList.key) > -1 &&
					<div className="row left-4x collapse collapse-padding">
						<div className="columns small-12 top-1x">
							<UIDropDownButton
								className="naked vertical-middle"
								buttonAction={this.toggleList}
								type="toggle"
								ddId={this.state.toggleList.toString()}
								label={this.state.toggleList ?
									<Fragment>
										<span>{t('table:filter.showmore')}</span>
										<span aria-hidden="true" className="icon-chevron-down"></span>
									</Fragment>
									: <Fragment>
										<span>{t('table:filter.showless')}</span>
										<span aria-hidden="true" className="icon-chevron-up"></span>
									</Fragment>}
							/>
						</div>
					</div>
				}
			</div>
		)
	}
}
export default FilterList;
