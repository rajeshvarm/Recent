import React, { Component } from "react";
import PropTypes from "prop-types";
import v4 from "uuid/v4";

/**
 * An accessible menu.
 *
 * childern are the contents of the menu. At least one interactive element
 * (button, a, input) should be present. Interactive elements may be a descendent
 * of another element ie an _p_ element. **React components are not recognized as
 * interactive elements** and won't be given focus using keyboard navigation.
 *
 * Child buttons and inputs should already have actions wired preferably using _onClick_.
 *
 * A child with attribute _data-nofocus_ will prevent the focus from moving back
 * to the menu button when the menu closes. Links and buttons that change focus
 * should have the _data-nofocus_ attribute.
 *
 * A child that does not want the menu closed when activated, needs to use the
 * _data-noclose_ attribute. Inputs should use _data-noclose_ on both the _label_
 * and _input_ elements.
 * @type {Object}
 */
export default class UIMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      focusIndex: null
    };

    let uuid = v4();
    this.buttonId = `${uuid}-mb`;
    this.menuId = `Z${uuid}-mp`; // This id is used with a DOM selector, the Z avoid invalid selector issues
  }

  static propTypes = {
    /**
     * the aria-label attribute for the menu button. Should only be used if
     * there is no label prop or in the very rare case when the visible label
     * is not sufficient for screen reader users.
     * @type {[type]}
     */
    ariaLabel: PropTypes.string,
    /**
     * Class(es) for the container of the menu button and menu. ie "columns large-4 small-6"
     * @type {[type]}
     */
    className: PropTypes.string,
    /**
     * Menu (button's) visible text
     * @type {[type]}
     */
    label: PropTypes.string,
    /**
     * Class(es) for the menu button
     * @type {[type]}
     */
    buttonClass: PropTypes.string,
    /**
     * An icon that appears left of the button text.
     * @type {[type]}
     */
    leftIcon: PropTypes.string,
    /**
     * An icon that appears right of the button text. ie "icon icon-caret-down"
     * @type {[type]}
     */
    rightIcon: PropTypes.string,
    /**
     * A class for the popup menu. This class should also affect the descendant ul and li elements.
     * @type {[type]}
     */
    menuClass: PropTypes.string
  };

  // Menu button onClick toggles showing the menu
  onClick = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  // keyup on a menuitem
  keyUp = event => {
    switch (event.key) {
      case "ArrowDown":
        event.stopPropagation();
        event.preventDefault();
        this.setState({ showMenu: true, focusIndex: 0 });
        break;

      case "ArrowUp":
        event.stopPropagation();
        event.preventDefault();
        this.setState({ showMenu: true, focusIndex: -1 });
        break;

      default:
      // do nothing
    }
  };

  // function passed to PopupMenu to close the menu
  menuClose = bool => {
    this.setState({ showMenu: false, focusIndex: null });
    if (bool) {
      // Move focus back to button when true
      try {
        document.getElementById(this.buttonId).focus();
      } catch (e) {
        // do nothing only needed for enzyme testing
      }
    }
  };

  // Builds the popup menu when it should be visible
  buildMenu = () => {
    if (!this.state.showMenu) return null;
    return (
      <PopupMenu
        id={this.menuId}
        close={this.menuClose}
        className={this.props.menuClass}
        focusIndex={this.state.focusIndex}
        buttonId={this.buttonId}
      >
        {this.props.children}
      </PopupMenu>
    );
  };

  render() {
    const {
      ariaLabel,
      className,
      label,
      buttonClass,
      rightIcon,
      leftIcon
    } = this.props;
    const bClass = buttonClass || "global";
    let rtIcon = rightIcon ? (
      <span aria-hidden="true" className={rightIcon} />
    ) : null;
    let ltIcon = leftIcon ? (
      <span aria-hidden="true" className={leftIcon} />
    ) : null;

    return (
      <div className={className}>
        <button
          aria-label={ariaLabel}
          className={bClass}
          id={this.buttonId}
          onClick={this.onClick}
          aria-haspopup="menu"
          aria-expanded={this.state.showMenu}
          onKeyUp={this.keyUp}
        >
          {ltIcon}
          {label}
          {rtIcon}
        </button>
        {this.buildMenu()}
      </div>
    );
  }
}

// The popup menu -- this component does not use state for focus changes as
// focus changes do not require a rerender
class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.focusIndex = props.focusIndex || 0;
  }

  // find menuitems, modify and set focus
  componentDidMount() {
    try {
      this.menuitems = document.getElementById(this.props.id).querySelectorAll("button, a, input");
      this.setMaxIndex(this.menuitems.length - 1);
      this.addMenuitemRole(this.menuitems);
    } catch (e) {
      // Only needed for enzyme testing
    }

    // An up arrow from the button will give a focusIndex of -1, move to last
    // focusable element
    if (this.focusIndex < 0) {
      this.focusIndex = this.maxIndex;
    }
    this.moveFocus(this.focusIndex);
  }

  // Needed for testing - this.maxIndex is populated in a componentDidMount
  // by counting the matching DOM elements (button, a, input)
  setMaxIndex = max => {
    this.maxIndex = max;
  }

  // function is not inlined to aid Jest testing
  addMenuitemRole = menuitems => {
    let len = menuitems.length;
    for (var i = 0; i < len; i++) {
      menuitems[i].setAttribute("tabindex", "-1");
      if (menuitems[i].tagName == "INPUT") {
        let type = menuitems[i].type;
        if ("radio" == type) {
          menuitems[i].setAttribute("role", "menuitemradio");
        } else if ("checkbox" == type) {
          menuitems[i].setAttribute("role", "menuitemcheckbox");
          menuitems[i].setAttribute("aria-checked", menuitems[i].checked);
        } else {
          menuitems[i].setAttribute("role", "menuitem");
        }
      } else {
        menuitems[i].setAttribute("role", "menuitem");
      }
    }
  }

  // Move focus within the menu
  moveFocus = ind => {
    if (this.maxIndex < 1) return;
    this.focusIndex = ind;
    try {
      this.menuitems[ind].focus();
    } catch (e) {
      // do nothing  only need a try/catch for enzyme testing
    }
  };

  // keyup on a menuitem
  keyUp = event => {
    switch (event.key) {
      case "ArrowDown":
        event.stopPropagation();
        event.preventDefault();
        if (this.focusIndex >= this.maxIndex) {
          this.moveFocus(0);
        } else {
          this.moveFocus(this.focusIndex + 1);
        }
        break;

      case "ArrowUp":
        event.stopPropagation();
        event.preventDefault();
        if (this.focusIndex > 0) {
          // move up one in the list
          this.moveFocus(this.focusIndex - 1);
        } else {
          // First item moves to text field
          this.moveFocus(this.maxIndex);
        }
        break;

      case "Escape":
        // Close menu
        event.stopPropagation();
        event.preventDefault();
        this.props.close(true);
        break;

      default:
      // do nothing
    }
  };

  blur = e => {
    // 200ms appears long enough for focus to move to an input with a click on the label
    window.setTimeout(this.closeMenuIfFocusIsNotWithin, 200);
  };

  // Close the menu if focus is not in the menu
  closeMenuIfFocusIsNotWithin = () => {
    try {
      let ae = document.activeElement;
      if (ae && ae.closest("#" + this.props.id)) return; // do nothing focus is still in the menu
    } catch (e) {
      // do nothing only needed for jest/enzyme testing
    }
    this.props.close(false);
  };

  setFocusIndexToTarget = target => {
    for (let i = 0; i < this.menuitems.length; i++) {
      if (target == this.menuitems[i]) {
        this.focusIndex = i;
        return;
      }
    }
  };

  click = e => {
    // The click listener is on the div, will get non-consumed clicks from children
    if (e.target != e.currentTarget) {
      if (e.target.getAttribute("data-noclose")) {
        this.setFocusIndexToTarget(e.target);
        return;
      }
      // Shift focus to the button on closing unless data-nofocus exists
      let b = !e.target.getAttribute("data-nofocus");
      this.props.close(b);
    }
  };

  render() {
    const { className, id, children, buttonId } = this.props;

    let lis = children.map((item, inx) => {
      return <li key={inx}>{item}</li>;
    });

    const divClass = className || "popupmenu mw12";

    return (
      <div
        className={divClass}
        id={id}
        onBlur={this.blur}
        onKeyUp={this.keyUp}
        onClick={this.click}
        aria-labelledby={buttonId}
        role="menu"
      >
        <ul>{lis}</ul>
      </div>
    );
  }
}
