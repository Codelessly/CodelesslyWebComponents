import { html, css, LitElement } from 'https://cdn.skypack.dev/lit@2.8.0';

class MyMenu extends LitElement {
  static styles = css`

    /* styles  */
    .dropdown {
        position: absolute;
        display: none;
      }
      .left {
        left: 0;
      }
      .right {
        right: 0;
      }
      .show {
        display: block;
      }

      .cl-menu {
        position: relative;
        display: flex;
        justify-content: space-between;
        }
        .cl-m-nav {
        position: relative;
        display: flex;
        padding: 0;
        margin: 0;
        }
        .cl-m-nav > li {
        list-style: none;
        position: relative;
        height: 39px;
        }
        .cl-m-nav > li a {
        display: inline-block;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.87);
        background: #fff;
        padding: 10px;
        box-shadow: 0 0 1px 0 #ccc;
        }

        /* dropdown menu  */
        .cl-m-options {
        position: absolute;
        left: 0;
        top: 100%;
        display: inline-block;
        background: #fff;
        box-sizing: border-box;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        min-width: 112px;
        transform-origin: top left;
        overflow: auto;
        opacity: 0;
        visibility: hidden;
        transform: scale(0);
        will-change: transform, opacity;
        transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1),
            -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);
        box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%),
            0 3px 14px 2px rgb(0 0 0 / 12%);
        border-radius: 4px;
        overflow: visible;
        z-index: 1;
        }
        .cl-m-options.show {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        will-change: transform, opacity;
        transition: opacity 0.03s linear, transform 0.12s cubic-bezier(0, 0, 0.2, 1),
            -webkit-transform 0.12s cubic-bezier(0, 0, 0.2, 1);
        box-shadow: 0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%),
            0 3px 14px 2px rgb(0 0 0 / 12%);
        }
        .from-right ~ .cl-m-options{
        left: unset;
        right: 0;
        transform-origin: top right;
        }
        .from-bottom ~ .cl-m-options{
        left: 0;
        bottom: 100%;
        top: unset;
        transform-origin: bottom left;
        }
        .from-bottom.from-right ~ .cl-m-options{
        left: unset;
        right: 0;
        bottom: 100%;
        top: unset;
        transform-origin: bottom right;
        }
        .cl-m-ul {
        margin: 0;
        padding: 8px 0;
        line-height: 1.5rem;
        font-size: 16px;
        }
        .cl-m-ul > li {
        cursor: pointer;
        position: relative;
        list-style: none;
        color: rgba(0, 0, 0, 0.87);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 16px;
        height: 48px;
        /*   overflow: hidden; */
        width: auto;
        }
        .cl-m-ul > li:hover {
        background: #f5f5f5;
        }
        .cl-m-ul > li span{
        display: block;
        white-space: nowrap;
        }
        .cl-m-ul > li > i {
        font-family: Material Icons;
        font-style: normal;
        color: #333;
        width: 14px;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
        text-transform: none;
        letter-spacing: normal;
        margin-right: 8px;
        }
        .cl-m-ul > li > i.check {
        color: #ccc;
        width: 16px;
        height: 16px;
        font-size: 16px;
        line-height: 16px;
        margin-left: 20px;
        }

        /* inner menu  */
        .cl-m-ul > li .cl-m-options.show{
        top: 0;
        left: 100%;
        }
        .cl-m-ul > li .cl-m-options.from-right{
        top: 0;
        left: unset;
        right: 100%;
        }
        .cl-m-ul > li .cl-m-options.from-bottom{
        left: 100%;
        bottom: 0;
        top: unset;
        transform-origin: bottom left;
        }
        .cl-m-ul > li .cl-m-options.from-bottom.from-right{
        left: unset;
        right: 100%;
        bottom: 0;
        top: unset;
        transform-origin: bottom right;
        }

  `;

constructor() {
  super();
  this.showDropdown = false;
}

firstUpdated() {
  this.updateOffsetClass();
  window.addEventListener('click', (event) => this.handleWindowClick(event));
}

render() {
  return html`
    <ul class="cl-m-nav">
      <li @click="${(event) => this.handleLiClick(event)}">
        <a href="#" class="${this.offsetClass}">Menu 3</a>
        <div class="dropdown cl-m-options  ${this.showDropdown ? 'show' : ''}" @click="${this.hideDropdown}">
          <ul class="cl-m-ul">
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        </div>
      </li>
    </ul>
  `;
}
handleLiClick(event) {
  event.stopPropagation();
  this.toggleDropdown();
}

toggleDropdown() {
  this.showDropdown = !this.showDropdown;
  this.requestUpdate();
}

hideDropdown() {
  this.showDropdown = false;
  this.requestUpdate();
}

updateOffsetClass() {
  const button = this.shadowRoot.querySelector('a');
  if (button) {
    const buttonRect = button.getBoundingClientRect();
    if (buttonRect.left < 100) {
      button.classList.add('from-left');
      button.classList.remove('from-right');
      console.log('from-left');
    } else if (window.innerWidth - buttonRect.right < 100) {
      button.classList.add('from-right');
      button.classList.remove('from-left');
      console.log('from-right');
    } else {
      button.classList.remove('from-left');
      button.classList.remove('from-right');
    }
    if (buttonRect.top < 100) {
      button.classList.add('from-top');
      button.classList.remove('from-bottom');
      console.log('from-top');
    } else if (window.innerHeight - buttonRect.bottom < 100) {
      button.classList.add('from-bottom');
      button.classList.remove('from-top');
      console.log('from-bottom');
    } else {
      button.classList.remove('from-top');
      button.classList.remove('from-bottom');
    }
  }
}

  handleWindowClick(event) {
    if (!this.shadowRoot.contains(event.target)) {
      this.hideDropdown();
    }
  }
}

customElements.define('my-menu', MyMenu);
