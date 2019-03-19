import React, { Component } from "react";
import PropTypes from "prop-types";
import v4 from "uuid/v4";
import { ALERTS } from "./modules/Enumerations";

export default class UIAlert extends Component {
  static defaultProps = {
    alertType: ALERTS.NOTIFICATION,
    icon: false
  };

  static propTypes = {
    /**
     * Title (bolded text) for the alert. If present (and no _ariaLabel_ prop is provided)
     * _alertTagLIne_ is used as the accessible name for the alert (this is a good thing).
     * @see {@link ariaLabel}
     * @type {[type]}
     */
    alertTagline: PropTypes.string,
    /**
     * Alert type sets background color and affects icon.
     * @type {[type]}
     */
    alertType: PropTypes.oneOf(Object.keys(ALERTS)),
    /**
     * If no _alertTagLine_ prop is provided an _ariaLabel_ prop should be
     * provided to give the alert an accessible name (used by screen readers). If an
     * _ariaLabel_ prop is provided it will be the accessible name for the alert.
     * @type {[type]}
     */
    ariaLabel: PropTypes.string,
    /**
     * Alert content should be passed as children and already translated.
     * If there is no alertTagLine prop, children will start on the same line as
     * an icon and close button, provided you use an inline element (ie span).
     * @see alertTagline
     * @type {[type]}
     */
    children: PropTypes.node,
    /**
     * Class(es) that should be applied to the alert instead of the standard classes.
     * @type {[type]}
     */
    className: PropTypes.string,
    /**
     * False will not show an icon. Providing a string will substitute the
     * string for the standard (default) icon classes for the alert type.
     * @type {[type]}
     */
    icon: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    /**
     * Required for a close button. If not present no close button will be added.
     * @type {[type]}
     */
    closeButton: PropTypes.shape({
      /**
       * aria-label for the close button.
       */
      ariaLabel: PropTypes.string.isRequired,
      /**
       * title attribute for the close button.
       */
      title: PropTypes.string,
      /**
       * Function that should be called when alert is closed
       */
      onClose: PropTypes.func
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      closed: false
    };
    this.uuid = v4();
  }

  handleClose = e => {
    e.preventDefault();
    const onClose =
      this.props.closeButton && this.props.closeButton.onClose
        ? this.props.closeButton.onClose
        : null;

    this.setState({ closed: true });
    if (onClose) onClose();
  };

  alertClass = () => {
    if (this.props.className) return this.props.className;
    let cl = null;
    switch (this.props.alertType) {
      case ALERTS.SUCCESS:
        cl = "alert-basic alert-success";
        break;

      case ALERTS.ERROR:
        cl = "alert-basic alert-error";
        break;

      case ALERTS.WARNING:
        cl = "alert-basic alert-warning";
        break;

      case ALERTS.NOTIFICATION:
      default:
        cl = "alert-basic notification";
    }
    cl =
      typeof this.props.icon === "boolean" && !this.props.icon
        ? cl + " noicon"
        : cl;
    return cl;
  };

  getRole = () => {
    const type = this.props.alertType;
    return (type === ALERTS.SUCCESS || type === ALERTS.WARNING || type === ALERTS.ERROR) ? "alert" : null;
  }

  iconClass = () => {
    if (typeof this.props.icon === "string") return this.props.icon;
    if (typeof this.props.icon === "boolean" && !this.props.icon) return null;

    let cl = null;
    switch (this.props.alertType) {
      case ALERTS.SUCCESS:
        cl = "icon icon-success";
        break;

      case ALERTS.ERROR:
        cl = "icon icon-exclamation-triangle";
        break;

      case ALERTS.WARNING:
        cl = "icon icon-warning";
        break;

      default:
    }
    return cl;
  };

  render() {
    const {
      alertTagline,
      alertType,
      ariaLabel,
      children,
      className,
      closeButton
    } = this.props;
    const { closed } = this.state;

    if (closed) return null;

    let taglineId = alertTagline && !ariaLabel ? `tl-${this.uuid}` : null;
    let button = closeButton ? (
      <button
        className="close x"
        onClick={this.handleClose}
        title={closeButton.title}
        aria-label={closeButton.ariaLabel}
        aria-controls={`a-${this.uuid}`}
        aria-expanded="true"
      />
    ) : null;
    let iClass = this.iconClass();
    let iconSpan = iClass ? (
      <span aria-hidden="true" className={iClass} />
    ) : null;

    return (
      <section
        className={this.alertClass()}
        id={`a-${this.uuid}`}
        role={this.getRole()}
        aria-label={ariaLabel}
        aria-labelledby={taglineId}
      >
        {button}

        {iconSpan}
        {alertTagline && <strong id={taglineId}>{alertTagline}</strong>}
        {children}
      </section>
    );
  }
}
