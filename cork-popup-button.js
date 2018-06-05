
import {PolymerElement, html} from "@polymer/polymer"
import template from "cork-popup-button.html"

import "@polymer/iron-icons"
import "@polymer/iron-icon"
import "@ucd-lib/cork-icons"

export class CorkPopupButton extends PolymerElement {

  static get properties() {
    return {
      label: {
        type: String,
        value: ''
      },
      icon: {
        type : String,
        value : ''
      },
      open: {
        type: Boolean,
        value: false,
        notify: true
      },
      noBtnArrow : {
        type : Boolean,
        value : false
      },
      tabindex : {
        type : Number,
        value : 1,
        reflectToAttribute : true
      }
    };
  }

  static get template() {
    return html([template]);
  }

  constructor() {
    super();
    this.hide = this.hide.bind(this);
    this._resetTriangle = this._resetTriangle.bind(this);

    this.addEventListener('keyup', this._onKeyUp.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateStyles();
    window.addEventListener('click', this.hide);
    window.addEventListener('resize', this._resetTriangle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this.hide);
    window.removeEventListener('resize', this._resetTriangle);
  }

  toggle() {      
    this.open = !this.open;
    this._resetTriangle();
  }

  _onKeyUp(e) {
    if( e.which !== 13 ) return;
    this._onClick(e);
  }

  _onClick(e) {
    this._prevent(e);
    this.toggle();
  }

  _prevent(e) {
    // stop original event
    e.preventDefault();
    e.stopPropagation();

    // send new click event, tagging this element as src
    var event = new CustomEvent('click', {
      bubbles : true, 
      composed : true,
      detail : {
        corkSrc : this
      } 
    });
    window.dispatchEvent(event);
  }

  focus() {
    this.$.btn.focus();
  }

  unfocus() {
    this.$.btn.unfocus();
  }

  hide(e) {
    if( e && e.detail && e.detail.corkSrc === this ) {
      return;
    }
    this.open = false;
  }

  _resetTriangle(noRetry) {
    if( !this.open ) return;

    var ww = window.innerWidth;
    var pw = this.$.popup.offsetWidth;

    var offset = this.$.btn.getBoundingClientRect();
    var bl = offset.left;
    var bw = offset.width;
    var pw = this.$.popup.offsetWidth;

    if( ww <= 768 ) {
      this.$.popup.style.left = (-1 * bl) + 'px';
      this.$.popup.style.right = (-1 * (ww - bl - bw)) + 'px';
    } else if( bl + pw > ww + 20 ) {
      this.$.popup.style.left = 'auto';
      this.$.popup.style.right = 0;
    } else {
      this.$.popup.style.left = 0;
      this.$.popup.style.right = 'auto';
    }

    var l = bw - 36;
    var max = pw - 40;
    if( l > max ) l = max;

    this.$.triangle.style.left = l+'px';

    if( !noRetry ) return;
    setTimeout(() => this._resetTriangle(true), 0);
  }
}

window.customElements.define('cork-popup-button', CorkPopupButton);