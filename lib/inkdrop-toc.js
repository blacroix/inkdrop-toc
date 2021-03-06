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
    this.MDEPreview.remarkReactOptions.remarkReactComponents.a = this.OrigA;
  }

  // noinspection JSMethodCanBeStatic
  onTocEntryClick(props) {
    const duration = 100;
    const entry = `user-content-${decodeURI(props.href.substr(1, props.href.length))}`;
    const offset = 300;
    const mdePreview = document.getElementsByClassName('mde-preview')[0];
    if (this.animation) {
      clearTimeout(this.animation);
      this.animation = null;
    }
    this.scrollTop(mdePreview, document.getElementById(entry).offsetTop + mdePreview.scrollTop - offset, duration);
  }

  scrollTop(element, offset, duration) {
    if (duration <= 0) {
      return;
    }
    const difference = offset - element.scrollTop;
    const perTick = difference / duration * 10;
    this.animation = setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop >= offset) {
        return;
      }
      this.scrollTop(element, offset, duration - 10);
    }, 10);
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