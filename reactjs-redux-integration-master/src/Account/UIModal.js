import React from 'react';
import PropTypes from 'prop-types';
const AriaModal = require('react-aria-modal');

//in package.json we have "react-aria-modal" : "2.3.1"

/**
 * Modal dialog wrapper for AriaModal with our styling and titling.
 * @param {[type]} visible true if visible
 * @param {[type]} onExit     [description]
 * @param {[type]} children   [description]
 * @param {[type]} props      [description]
 *
 *    HOW TO USE:
 * 1. Pass a visible prop that is a BOOLEAN whether or not the modal is open
 * 2. Pass an onExit prop that is a FUNCTION which sets the modal visibility to false
 * 3. The button you use (must be a button, not a link) to toggle the modal's visibility
 *    needs to have the attribute aria-haspopup="dialog"
 * 4. Write your mark-up inside of your <UIModal></UIModal> container
 * 5. The title of your modal should be an h2 and it should have the id "modal-title"
 * 6. {...props} is an optional black-box api that allows you to pass additional props
 *    beyond what's required by the propTypes straight through from the UIModal instance
 *    you write in your code to the AriaModal instance that appears on the screen
 */
const UIModal = ({visible, onExit, children, dialogClasses, ...props}) => (
  <AriaModal
    {...props}
    aria-modal="true"
    mounted={visible}
    onExit={onExit}
    getApplicationNode={()=>document.getElementById("app")}
    titleId="modal-title"
    includeDefaultStyles={false}
    dialogClass={`modal-container ${props.fullPageOverlay && "fullPage"} ${dialogClasses||""}`}
    underlayClass={props.fullPageOverlay ? "modal-full-overlay" : "modal-overlay"}
  >
    {children}
  </AriaModal>
);

UIModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  fullPageOverlay: PropTypes.bool,
//   children: PropTypes.arrayOf(PropTypes.object)
}

export default UIModal;
