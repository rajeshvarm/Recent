import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ALERTS} from 'UI/modules/Enumerations';
import UILoader from 'UI/UILoader';
import UIAlert from 'UI/UIAlert';

class LoaderExtended extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};

    state['fetching'] = props.requestOnEveryVisit ? true : !(props.initialized || props.error);
    state['error'] = props.error || false;

    return state;
  }

  componentDidMount = () => {
    const {requestOnEveryVisit, action, actionData} = this.props;

    if(requestOnEveryVisit) {
      this.props.dispatch(action(actionData));
    } else if(this.state.fetching) {
      this.props.dispatch(action(actionData));
    }
  }

  componentDidUpdate = (prevProps) => {
    let initialized = this.props.initialized || false;
    let error = this.props.error || false;

    if(prevProps.initialized !== initialized || prevProps.error !== error) {
      this.updateState(initialized, error);
    }
  }

  updateState = (initialized, error) => {    
    const fetchingStatus = !(initialized || error);
    
    this.setState({
      'fetching': fetchingStatus,
      'error': error
    });

    return;
  }

  renderError = (t, showError) => {
    return(
      <div className="row collapse">
        {
          showError ? (
            <UIAlert
              ariaLabel="Service Error"
              alertType={ALERTS.ERROR}
              className="alert collapse text-left top-1x">
              <p><strong>Oops:</strong> We are very sorry. Something unexpected happened and the application was not able to recover, please clear your cache and try again.</p>
            </UIAlert>
          ) : ''
        }
      </div>
    );
  }

  render() {
    const {t, children, className, showError} = this.props;
    const {fetching, error} = this.state;

    return(
      <UILoader isFetching={fetching} className={className} errorMessage={error ? this.renderError(t, showError) : ''}>
        {children}
      </UILoader>
    );
  }

  static defaultProps = {
    actionData: '',
    initialized: false,
    error: false,
    requestOnEveryVisit: false,
    showError: true
  }

  static propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    action: PropTypes.func.isRequired,
    actionData: PropTypes.oneOfType([
                          PropTypes.string, 
                          PropTypes.object, 
                          PropTypes.array
                        ]),
    initialized: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    requestOnEveryVisit: PropTypes.bool,
    showError: PropTypes.bool
  }
}

export default LoaderExtended;
