import { html, css, LitElement } from 'https://cdn.skypack.dev/lit@2.8.0';

class AccordionItem extends LitElement {
  static styles = css`
    .accordion-item {
      position: relative;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
    }
    .accordion-header {
      padding: 20px;
      background: rgb(98 0 238 / 100%); /* default panel head color */
      color: #fff;
      border-bottom: 1px solid rgb(243 243 243 / 46%);
      cursor: pointer;
      font-size: 15px;
      line-height: normal;
      transition: all 0.3s;
    }
    .accordion-header:hover{
      background: rgb(98 0 238 / 90%); /* panel hover color */
      position: relative;
      z-index: 5;
    }
    .accordion-content {
      background: #fcfcfc; /* content bg color */
      color: #353535;
      font-size: 14px;
      line-height: 2;
      display: none;
    }
    .accordion-content[open] {
      display: block;
    }
  `;

  static properties = {
    title: { type: String },
    open: { type: Boolean },
  };

  constructor() {
    super();
    this.title = '';
    this.open = false;
  }

  render() {
    return html`
      <div class="accordion-item">
        <div class="accordion-header" @click=${this.toggleOpen}>
          ${this.title}
        </div>
        <div class="accordion-content" ?open=${this.open}>
          <slot></slot>
        </div>
      </div>
    `;
  }

  toggleOpen() {
    this.open = !this.open;
  }
}

customElements.define('accordion-item', AccordionItem);

class NestedAccordion extends LitElement {
  static styles = css`
    .nested-accordion {
      padding: 10px;
    }
  `;

  render() {
    return html`
      <div class="nested-accordion">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('nested-accordion', NestedAccordion);
