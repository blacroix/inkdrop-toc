'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _remarkToc = require('remark-toc');

var _remarkToc2 = _interopRequireDefault(_remarkToc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TocPlugin {

  constructor(MDEPreview) {
    this.MDEPreview = MDEPreview;
  }

  // noinspection JSUnusedGlobalSymbols
  start() {
    if (this.MDEPreview) {
      this.MDEPreview.remarkPlugins.push(_remarkToc2.default);
      this.setTocComponent();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  stop() {
    if (this.MDEPreview) {
      this.MDEPreview.remarkPlugins = this.MDEPreview.remarkPlugins.filter(plugin => plugin !== _remarkToc2.default);
      this.unsetTocComponent();
    }
  }

  setTocComponent() {
    // noinspection JSUnresolvedVariable
    this.OrigA = this.MDEPreview.remarkReactOptions.remarkReactComponents.a;
    const hash = '#';
    // noinspection JSUnresolvedVariable
    this.MDEPreview.remarkReactOptions.remarkReactComponents.a = props => {
      if (props.href && props.href.startsWith(hash)) {
        return _react2.default.createElement(
          'a',
          _extends({}, props, { onClick: () => this.onTocEntryClick(props) }),
          props.children
        );
      } else if (this.OrigA) {
        return _react2.default.createElement(
          OrigA,
          props,
          props.children
        );
      } else {
        return _react2.default.createElement(
          'a',
          props,
          props.children
        );
      }
    };
  }

  unsetTocComponent() {
    // noinspection JSUnresolvedVariable
    const hash = '#';
    // noinspection JSUnresolvedVariable
    this.MDEPreview.remarkReactOptions.remarkReactComponents.a = props => {
      if (props.href && props.href.startsWith(hash)) {
        if (this.OrigA) {
          return _react2.default.createElement(
            OrigA,
            props,
            props.children
          );
        } else {
          return _react2.default.createElement(
            'a',
            props,
            props.children
          );
        }
      }
    };
  }

  // noinspection JSMethodCanBeStatic
  onTocEntryClick(props) {
    const duration = 200;
    const entry = `#user-content-${props.href.substr(1, props.href.length)}`;
    const offset = 300;
    const mdePreview = $('.mde-preview');
    // noinspection JSUnresolvedFunction
    mdePreview.stop().animate({ scrollTop: $(entry).first().offset().top + mdePreview.scrollTop() - offset }, duration);
  }

}

module.exports = {

  toc: null,

  activate() {
    // noinspection JSUnresolvedVariable
    const { MDEPreview } = inkdrop.components.classes; // eslint-disable-line
    if (MDEPreview) {
      this.toc = new TocPlugin(MDEPreview);
      this.toc.start();
    }
  },

  deactivate() {
    // noinspection JSUnresolvedVariable
    this.toc.stop();
    this.toc = null;
  }

};