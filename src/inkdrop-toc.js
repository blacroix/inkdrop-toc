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
