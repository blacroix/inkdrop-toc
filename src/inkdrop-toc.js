import React from 'react';
import Toc from 'remark-toc';

class TocPlugin {

  constructor(MDEPreview) {
    this.MDEPreview = MDEPreview;
  }

  // noinspection JSUnusedGlobalSymbols
  start() {
    if (this.MDEPreview) {
      this.MDEPreview.remarkPlugins.push(Toc);
      this.setTocComponent();
    }
  }

  // noinspection JSUnusedGlobalSymbols
  stop() {
    if (this.MDEPreview) {
      this.MDEPreview.remarkPlugins = this.MDEPreview.remarkPlugins.filter((plugin) => plugin !== Toc);
      this.unsetTocComponent();
    }
  }

  setTocComponent() {
    // noinspection JSUnresolvedVariable
    this.OrigA = this.MDEPreview.remarkReactOptions.remarkReactComponents.a;
    const hash = '#';
    // noinspection JSUnresolvedVariable
    this.MDEPreview.remarkReactOptions.remarkReactComponents.a = (props) => {
      if (props.href && props.href.startsWith(hash)) {
        return <a {...props} onClick={() => this.onTocEntryClick(props)}>{props.children}</a>;
      } else if (this.OrigA) {
        return <OrigA {...props}>{props.children}</OrigA>;
      } else {
        return <a {...props}>{props.children}</a>;
      }
    };
  }

  unsetTocComponent() {
    // noinspection JSUnresolvedVariable
    const hash = '#';
    // noinspection JSUnresolvedVariable
    this.MDEPreview.remarkReactOptions.remarkReactComponents.a = (props) => {
      if (props.href && props.href.startsWith(hash)) {
        if (this.OrigA) {
          return <OrigA {...props}>{props.children}</OrigA>;
        } else {
          return <a {...props}>{props.children}</a>;
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
    mdePreview.stop().animate({scrollTop: $(entry).first().offset().top + mdePreview.scrollTop() - offset}, duration);
  }

}

module.exports = {

  toc: null,

  activate() {
    // noinspection JSUnresolvedVariable
    const {MDEPreview} = inkdrop.components.classes; // eslint-disable-line
    if (MDEPreview) {
      this.toc = new TocPlugin(MDEPreview);
      this.toc.start();
    }
  },

  deactivate() {
    // noinspection JSUnresolvedVariable
    this.toc.stop();
    this.toc = null;
  },

};
