import React, { Component, Fragment } from 'react';
import { translate, Interpolate } from 'react-i18next';

@translate(['common'])
class SlidingCards extends Component {
  render() {
    return (
      <div>
      <div className="standard panel">
        <h3>Take your Annual health assesment</h3>
      </div>
      <div className="standard panel">
        <h3>Take your Annual health assesment</h3>
      </div>
      <div className="standard panel">
        <h3>Take your Annual health assesment</h3>
      </div>
      <div className="standard panel">
        <h3>Take your Annual health assesment</h3>
      </div>
      </div>
    )
  }
}

export default SlidingCards;