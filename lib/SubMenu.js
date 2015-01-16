/** @jsx React.DOM */

/**
 *  SubMenu
 *  - thanks react-bootstrap
 *  - Reference DropdownButton.jsx
 * */

var React = require('react');
var joinClasses = require('./utils/joinClasses');
var classSet = require('./utils/classSet');
var cloneWithProps = require('./utils/cloneWithProps');
var util = require('./utils/util');
var KeyCode = util.KeyCode;
var SubMenuStateMixin = require('./SubMenuStateMixin');

var SubMenu = React.createClass({
  propTypes: {
    openWhenHover: React.PropTypes.bool,
    title: React.PropTypes.node,
    buttonClass: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  mixins: [SubMenuStateMixin],

  getDefaultProps: function () {
    return {
      openWhenHover: true,
      title: '',
      buttonClass: ''
    };
  },

  handleKeyDown: function (e) {
    var keyCode = e.keyCode;
    var menu = this.refs[this.nameRef];

    if (keyCode === KeyCode.ENTER){
      this.handleClick(e);
      return true;
    }

    if (keyCode === KeyCode.RIGHT) {
      if (this.state.open) {
        menu.handleKeyDown(e);
      } else {
        this.setOpenState(!this.state.open);
      }
      return true;
    }
    if (keyCode === KeyCode.LEFT) {
      var back = false;
      if (this.state.open) {
        back = menu.handleKeyDown(e);
      } else {
        return back;
      }
      if (back) {
        this.setOpenState(false);
      }
      return true;
    }

    if (this.state.open && (keyCode === KeyCode.UP || keyCode === KeyCode.DOWN)) {
      menu.handleKeyDown(e);
      return true;
    }

  },

  handleHover: function () {
    if (!this.state.open){
      this.props.selectItem(this);
    }
  },

  handleClick: function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.open){
      this.props.selectItem(this, true);
    }
  },

  render: function () {
    var prefix = this.props.prefix || 'rc-';
    var classes = {
      open: this.state.open,
      active: this.props.active
    }, id = util.guid();

    classes[prefix + 'submenu'] = true;

    return (
      <li
        ref="_subMenuLi"
        onMouseEnter={this.handleHover}
        //onMouseLeave={this.handleLeave}
        className={joinClasses(this.props.className, classSet(classes))}>
        <a
          {...this.props}
          //ref={"subMenuButton" + id}
          ref="_subMenuButton"
          title={null}
          buttonClass={null}
          className={this.props.buttonClass}
          onClick={this.handleClick}
          role="button"
          aria-expanded={this.props.active}
          aria-owns={id}
          aria-haspopup="true"
        >
        {this.props.title}
        </a>
          {this.renderChildren(this.props.children)}
      </li>
    );
  },
  renderChildren: function (children) {
    try {
      var menu = React.Children.only(children);
      this.nameRef = menu.ref || '__' + util.keywords.Menu + util.guid() ;
      if (React.isValidElement(menu) && menu.type.displayName === util.keywords.Menu) {
        return cloneWithProps(menu, {
          focusable: false,
          ref: this.nameRef,
          key: menu.key || Date.now()
        });
      }
    } catch (e) {
      console.log('SubMenu must have one child and it should be <Menu>...</Menu>');
    }
  }
});

module.exports = SubMenu;