import React from 'react';
import PropTypes from 'prop-types';

const renderSpinner = (className) => {
  return(
    <div class={`row ${className}`}>
      <div class="columns large-12 medium-12 small-12">
        <div class="cover">
          <div class="text-center" />
          <div class="loader" />
        </div>
      </div>
    </div>
  );
}

/**
 * A wrapper for a component that loads on a response else it will show spinner.
 */
const UILoader = (props) => {
  const {isFetching, className, errorMessage} = props;

  return(
    <div aria-busy={isFetching}>
      {isFetching && errorMessage === '' && renderSpinner(className)}

      {!isFetching && errorMessage}

      {!isFetching && errorMessage === '' && props.children}
    </div>
  );
}

UILoader.defaultProps = {
  isFetching: true,
  className: 'top-1x bottom-1x',
  errorMessage: '',
}

UILoader.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  className: PropTypes.string,
  errorMessage: PropTypes.oneOfType([
                            PropTypes.string, 
                            PropTypes.element
                          ]).isRequired
}

export default UILoader;