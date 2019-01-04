import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { translate, Interpolate } from 'react-i18next';
import * as helper from "./modules/FieldPartialHelper.js";
import * as fl from "./modules/FieldLayout.js";

/**
 * Input field component
 * @extends Component
 */
class UIInputField extends Component {
  constructor(props){
    super(props);
    let v = (props.defaultValue) ? props.defaultValue : "";
     this.state = {
     value: v,
     initial: v,
     ddState: helper.getDDState(props)
   };
  }


  dropDownAction = (a, b, c) =>{
    let newState = this.state.ddState.update(a, b, c);
    if (newState) {
      // if (this.state.ddState.changeFocus()) {
      // 	var refId = this.state.ddState.triggerRef();
      // 	this.refs[refId].focus();
     // }
     this.setState( { value: this.state.value, ddState: newState});
    }

  }

  //onChange, update the component state with the changed value
  change = (event) => {
    /* if the onChangeOverride prop is true, we want to override the
       onValidatedChange event handler to be called onChange instead of onBlur */
    if (this.props.onChangeOverride) {
      this.props.onValidatedChange(this.props.name, event.target.value);
    /* else, use the standard api where onChange, the event gets updated in state
       and only on the onBlur event does the onValidatedChange event handler get fired */
    } else {
      this.setState({value: event.target.value})
    }
  }

  /* Format the user-entered value such that strings are "trimmed" and empty strings converted to null
     -the specific reason we never want empty strings is because as of EDE phase 2, the back-end
      treats empty strings and null differently whereas the front end treats them the same because
      of how Validate.js works. By only using null instead of empty strings, we avoid triggering
      undesired back-end validation errors. */
  formatInput = input => {
    //if our value is a non-empty string (i.e. a string containing any non-space characters)
    if (typeof input === 'string' && input.trim().length) {
      //just trim away whitespace from the value
      return input.trim();
    }
    //else default to null
    return null;
  }

  //onBlur, call the parent's onValidatedChange function with the input-field's name and current value
  validate = () => {
    //format the user-entered value such that strings are "trimmed" and empty strings converted to null
    let finalValue = this.formatInput(this.state.value);

    //invoke the parent component's change handler function with the field name and formatted value
    this.props.onValidatedChange(this.props.name, finalValue);
    //re-save the value in state in the event of any formatting changes
    this.setState({value:finalValue});
  }

  static getDerivedStateFromProps(props, currentState) {
    let value = props.defaultValue == (null || undefined) ? "" : props.defaultValue;
    let valueUpdate = (value !== currentState.initial);
    let ddsChanged = (props.dropDownChildren && !currentState.ddState) || (currentState.ddState && !props.dropDownChildren);
    // Most common case, no state change needed
    if (!valueUpdate && !ddsChanged) return null;

    let update = (valueUpdate) ? 1 : 0;
    update += (ddsChanged) ? 2 : 0;

    let changed = null;

    switch (update) {
      case 1:
      changed = { value: value, intial: value};
      break;
      case 2:
      changed = { ddState: helper.getDDState(props)};
      break;
      case 3:
        changed = {
          value: value,
          initial: value,
          ddState: helper.getDDState(props)
        };
      break;
      default:
      // do nothing

    }
    return changed;
  }

  //necessary for same-page updates (e.g. multiple people cycling through the same page/form)
  // componentWillReceiveProps(nextProps){
  //   if (nextProps.defaultValue !== this.props.defaultValue) {
  //     let newValue = nextProps.defaultValue;
  //     this.setState({value: newValue});
  //   }
  // }


  render() {
    let label = helper.labelPartial(this.props);
    let ariaDescribedby = helper.ariaDescribedby(this.props);
    let textInput = ( <input autoComplete={this.props.autocomplete} type={this.props.type} className={this.props.symbol?"symbol":""} required={this.props.required} value={this.state.value} name={this.props.name}  maxLength={this.props.maxLength} id={this.props.name} onChange={this.change} onBlur={this.validate} aria-describedby={ariaDescribedby} /> );

    let error = helper.errorPartial(this.props);
		let description = helper.descriptionPartial(this.props, "large-inline optional");
		let openButton = (this.state.ddState) ? helper.openDropDownButtonPartial(
					this.props, this.state.ddState, this.dropDownAction) : null;

		let dropdown = (this.props.dropDownChildren) ? helper.dropDownPartial(this.props, this.state.ddState, this.dropDownAction, LAYOUTS.COLUMNS4) : null;

		return fl.layout(label, textInput, description, openButton, dropdown, error, this.props.layout, this.props.className);
  }

  // PROPS ......................................................
  static defaultProps = {
    autocomplete: "on",
    required: false,
    symbol:"",
    defaultValue:"",
    maxLength:"255",
    type: "text",
    layout: LAYOUTS.COLUMNS4,
  }

  static propTypes = {
    /**
     * Our best practice is to enable autocomplete see
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete}
     * for autocomplete values.  To disable autocomplete use "off"
     * @type {[type]}
     */
    autocomplete: PropTypes.string,
    /**
     * Required attribute set to true if this field is required
     * @type {[type]}
     */
    required: PropTypes.bool,
    /**
     * input type
     * @type {[type]}
     */
    type: PropTypes.string,
    /**
     * Label for the input, this should be a string or a label element
     * @type {[type]}
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Classes for the label
     * @type {[type]}
     */
    labelClasses: PropTypes.string,
    className: PropTypes.string,
    /**
     * A prop that should not be visible in the documentation.
     *
     * @ignore
     */
    symbol: PropTypes.string,
    /**
     * Initial value of the input
     * @type {[type]}
     */
    defaultValue: PropTypes.string,
    /**
     * Error message for this input (only present when there is an error)
     * @type {[type]}
     */
    errorMessage:PropTypes.string,
    /**
     * name attribute, should be unique on page, used as base for ids
     * relating to this component
     * @type {[type]}
     */
    name: PropTypes.string.isRequired,
    /**
     * visible description for the field - not often used, typical values are
     * "Optional" and format information
     * @type {[type]}
     */
    maskLabel: PropTypes.string,
    //standard change handler that fires onBlur (when input-field is left)
    onValidatedChange: PropTypes.func.isRequired,

    maxLength: PropTypes.string,
    /**
     * layout default is four53
     * @type {[type]}
     */
    layout: PropTypes.symbol,
    /**
     * Props for dropdown excluding children, including buttons.
     * @see dropDownChildren
     * @type {[type]}
     */
    dropDown: PropTypes.shape({
      /**
       * true will show the dropdown whe first rendered
       * @type {[type]}
       */
      visible: PropTypes.bool,
      /**
       * Props for an open button, default is to have an open button when there is a dropdown
       * @type {[type]}
       */
      openButton: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
      /**
       * Props for a close button, default is to have a close button, false
       * will prevent a close button
       * @type {[type]}
       */
      closeButton: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
      /**
       * Props for a close button at the bottom of the dropdown, default is
       * no close button
       * @type {[type]}
       */
      footClose: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
      /**
       * Classes for the dropdown container
       * @type {[type]}
       */
      className: PropTypes.string,
      /**
       * Label for the dropdown
       * @type {[type]}
       */
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    }),
    /**
     * Contents for a dropdown below the select, other props for the dropdown
     * are in dropDown
     * @see dropDown
     * @type {[type]}
     */
    dropDownChildren: PropTypes.element
  }
}

export default UIInputField;
