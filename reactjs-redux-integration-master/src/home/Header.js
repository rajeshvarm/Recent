/* Base Libraries */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { translate, Interpolate } from 'react-i18next';
import SlidingCards from './SlidingCards';

//import PropTypes from 'prop-types';


@translate(['common'])
class Header extends Component {
  constructor(props){
    super(props);
    this.state = {};
    /* Set any form default state values */
  }

  render() {
    const { t } = this.props;
                                                 
    return (
      <section>
        <div className="row header-banner bottom-2x">
          <div className="columns small-12 medium-3 large-1 banner-button">
            <button className="circle-button">
              <span aria-hidden="true" class="icon icon-plus icon-3x" />
            </button>
          </div>
          <div className="columns small-12 medium-4 large-4 top-2x header-content">
            <h1>Good Morning Karen.</h1>
            <h2>Let's start by focusing on what you want to accomplish.</h2>
          </div>
          <div className="columns small-12 medium-5 large-7 top-2x">
            <SlidingCards/>
          </div>
        </div>
      </section>
    );
  }

  /* Default/Expected Props */
  // static defaultProps = {};
  // static propTypes = {};
}

function mapStateToProps(state){
  return { 
    // routes:state.rootReducer,
    // address:state.AddressReducer,
    // county:state.CountyReducer
  }
}

export default withRouter(connect(mapStateToProps)(Header));
