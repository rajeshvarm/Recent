import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import MediaQuery from 'react-responsive';
import UIMenu from "UI/UIMenu";
import * as RouteConstants from 'constants/routes';

const allNavs = {
	'isHome': '',
	'isCoverage': '',
	'isCarePlan': '',
	'isCareTeam': '',
	'isFindCare': ''
};

const setRef = {
	isCoverage: React.createRef(),
	isCarePlan: React.createRef(),
	isCareTeam: React.createRef(),
	isFindCare: React.createRef()
};

@translate(['common', 'header'])
class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = this.ingressDataTransform(props);
	}

	ingressDataTransform = (props) => {
		console.log("props:", props)
		let state = {
			...allNavs
		};
		state.isMobileToggled = false;
		state.mobileClass = '';
		return state;
	}

	componentDidUpdate() {
		// remove active class when UIMenu is not rendered
		const keys = Object.keys(setRef);
		for (const key of keys) {
			// IF UIMenu visible state is false and UIMenu has .active class
			if (setRef[key].current && !setRef[key].current.state.showMenu && setRef[key].current.props.buttonClass) {
				this.setState({ [key]: '' });	// clear class from UIMenu button
			}
		}
	}

	selectNav = (key, path) => {
		// const offsetValue = document.querySelector(`nav [href*="${path}"]`).offsetTop;
		this.setState((state) => {
			return {
				...state,
				// Resetting navs
				...allNavs,
				[key]: 'active'
			};
		});
	}

	handleMobileToggle = (e) => {
		console.log('handleMobileToggle ========');
		var updateState = this.state.isMobileToggled ? false : true;
		var updateClass = this.state.isMobileToggled ? '' : 'active';
		this.setState((prevState) => ({ ['mobileClass']: updateClass }));
		this.setState((prevState) => ({ ['isMobileToggled']: updateState }));
	};

	renderMobileNav = (t) => {
		return (
			<nav id="main-nav" class={`vertical mobile ${this.state.mobileClass}`}>
				<button class="toggle" onClick={this.handleMobileToggle.bind(this)} aria-expanded={this.state.isMobileToggled}><span class="icon icon-menu-mobile" aria-label="Menu"></span></button>
				{this.state.mobileClass == "active" && this.renderNav(t)}
			</nav>
		)
	}

	renderDesktopNav = (t) => {
		return (
			<nav id="main-nav">
				{this.renderNav(t)}
			</nav>
		)
	}

	renderNav = (t) => {
		return (
			<ul>
				<li class={this.state.isHome}><Link to={RouteConstants.HOME}>{t("header:nav.home")}</Link></li>

				<li onClick={() => this.selectNav("isCoverage")}>
					<UIMenu
						className="text-left"
						buttonClass={this.state.isCoverage}
						label={t("header:nav.coverage")}
						menuClass="sub-nav"
						ref={setRef.isCoverage}
					>
						<Link data-nofocus to={'/claims'}>{t("header:nav.claims")}</Link>
						<Link data-nofocus to={'/appeals'}>{t("header:nav.appeals")}</Link>
						<Link data-nofocus to={'/authorization'}>{t("header:nav.authorizations")}</Link>
						<Link data-nofocus to={'/healthStatements'}>{t("header:nav.healthStatements")}</Link>
						<Link data-nofocus to={'/benefits'}>{t("header:nav.benefits")}</Link>
						<Link data-nofocus to={'/deductibles'}>{t("header:nav.deductibles")}</Link>
						<Link data-nofocus to={'/idCard'}>{t("header:nav.idCard")}</Link>
						<Link data-nofocus to={'/documentsForms'}>{t("header:nav.documentsForms")}</Link>
						<Link data-nofocus to={'/glossary'}>{t("header:nav.glossary")}</Link>
						<Link data-nofocus to={'/billPay'}>{t("header:nav.billPay")}</Link>
					</UIMenu>
				</li>
				<li onClick={() => this.selectNav("isCarePlan")}>
					<UIMenu
						className="text-left"
						buttonClass={this.state.isCarePlan}
						label={t("header:nav.carePlan")}
						menuClass="sub-nav"
						ref={setRef.isCarePlan}
					>
						<Link data-nofocus to={'/carePlan'}>{t("header:nav.carePlan")}</Link>
						<Link data-nofocus to={'/healthRecords'}>{t("header:nav.healthRecords")}</Link>
						<Link data-nofocus to={'/riskFactors'}>{t("header:nav.riskFactors")}</Link>
						<Link data-nofocus to={'/vitals'}>{t("header:nav.vitals")}</Link>
						<Link data-nofocus to={'/goals'}>{t("header:nav.goals")}</Link>
						<Link data-nofocus to={'/activities'}>{t("header:nav.activities")}</Link>
						<Link data-nofocus to={'/challenges'}>{t("header:nav.challenges")}</Link>
						<Link data-nofocus to={'/events'}>{t("header:nav.events")}</Link>
						<Link data-nofocus to={'/programs'}>{t("header:nav.programs")}</Link>
						<Link data-nofocus to={'/communities'}>{t("header:nav.communities")}</Link>
						<Link data-nofocus to={'/articles'}>{t("header:nav.articles")}</Link>
						<Link data-nofocus to={'/rewards'}>{t("header:nav.rewards")}</Link>
					</UIMenu>
				</li>
				<li onClick={() => this.selectNav("isCareTeam")}>
					<UIMenu
						className="text-left"
						buttonClass={this.state.isCareTeam}
						label={t("header:nav.careTeam")}
						menuClass="sub-nav"
						ref={setRef.isCareTeam}
					>
						<Link data-nofocus to={'/mycareteam'}>{t("header:nav.myCareTeam")}</Link>
						<Link data-nofocus to={'/inviteMember'}>{t("header:nav.inviteMember")}</Link>
					</UIMenu>
				</li>
				<li onClick={() => this.selectNav("isFindCare")}>
					<UIMenu
						className="text-left"
						buttonClass={this.state.isFindCare}
						label={t("header:nav.findCare")}
						menuClass="sub-nav"
						ref={setRef.isFindCare}
					>
						<Link data-nofocus to={RouteConstants.FINDCARE}>{t("header:nav.findCare")}</Link>
						<Link data-nofocus to={'/telemedicine'}>{t("header:nav.telemedicine")}</Link>
						<Link data-nofocus to={`${RouteConstants.FINDCARESEARCH}?type1=urgent-care`}>{t("header:nav.urgentCare")}</Link>
						<Link data-nofocus to={'/bookAppointment'}>{t("header:nav.bookAppointment")}</Link>
						<Link data-nofocus to={'/nationally'}>{t("header:nav.nationally")}</Link>
						<Link data-nofocus to={'/worldwide'}>{t("header:nav.worldwide")}</Link>
						<Link data-nofocus to={'/medicalCosts'}>{t("header:nav.medicalCosts")}</Link>
						<Link data-nofocus to={'/drugPricing'}>{t("header:nav.drugPricing")}</Link>
					</UIMenu>
				</li>
			</ul>
		)
	}

	render() {
		const { t } = this.props;

		return (
			<MediaQuery minDeviceWidth={1024}>
				{(matches) => {
					if (matches) {
						return this.renderDesktopNav(t);
					} else {
						return this.renderMobileNav(t);
					}
				}}
			</MediaQuery>
		)
	}


	// PROPS ......................................................
	static defaultProps = {};

	static propTypes = {};
}

function mapStateToProps(state) {
	return {

	};
}

export default connect(mapStateToProps)(Navigation);
