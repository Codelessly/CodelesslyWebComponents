
import { html, css, LitElement } from 'https://cdn.skypack.dev/lit@2.8.0';

class ToggleComponent extends LitElement {
  constructor() {
    super();
    this.active = false;
    this.start = 0;
    this.distanceX = 0;
    this.clickedClass;
    this.addEventListener('touchstart', this.startCursor.bind(this), false);
    this.addEventListener('touchend', this.dragCursor.bind(this), false);
    this.addEventListener('touchmove', this.moveCursor.bind(this), false);
    this.addEventListener('mousedown', this.startCursor.bind(this), false);
    this.addEventListener('mousemove', this.moveCursor.bind(this), false);
    this.addEventListener('mouseup', this.dragCursor.bind(this), false);
  }
  
   static styles = css`
    
/* style */
.cl-togglecomponent{
  width: 59px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cl-toggleswitch {
  position: relative;
  display: inline-block;
  border-radius: 7px;
  width: 33px;
  height: 14px;
  background-color: rgb(0, 0, 0, 0.38); /*inactive track color */
  transition: background-color 0.2s, opacity 0.2s;
}

.cl-toggleswitch > #toggle-id {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  visibility: hidden;
  opacity: 0;
}

.cl-toggle {
  position: absolute;
  top: 50%;
  left: -3px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff; /* inactive thumb color */
  z-index: 1;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
}
.cl-toggle:hover {
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%), 0 0 0 10px rgb(0, 0, 0, 0.1); /* inactive thumb hover color */
}
.switch-on > .cl-toggle:hover {
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%), 0 0 40px 0 rgb(0, 0, 0, 0.1),
    0 0 0 10px rgb(1, 135, 134, 0.1); /* active thumb hover color */
}
.switch-on > .cl-toggle {
  background-color: #018786; /* active thumb color */
}
.switch-on.cl-toggleswitch {
  background-color: #85b8b7; /* active track color */
  transition: background-color 0.2s;
}
  `;

  startCursor(e) {
    if (e.target.classList.contains('cl-toggle-js')) {
      this.clickedClass = e.target;

      const startVal = e.type == 'touchstart' ? e.touches[0].clientX : e.clientX;
      const scaleValue = this.getScaleValue();

      this.start =
        startVal / scaleValue -
        (this.clickedClass.getAttribute('checked') ? 20 : 0);
      this.active = true;
    }

    if (
      e.target.classList.contains('cl-togglecomponent-js') ||
      e.target.classList.contains('cl-toggleswitch-js')
    ) {
      this.clickedClass = e.target.querySelector('.cl-toggle-js');
      this.active = true;
    }
  }

  moveCursor(e) {
    if (this.active) {
      if (this.start == 0) {
        this.active = false;
        return;
      }
      let clientWidth =
        e.type == 'touchmove' ? e.touches[0].clientX : e.clientX;
      const scaleValue = this.getScaleValue();
      clientWidth = clientWidth / scaleValue;
      this.distanceX = clientWidth - this.start;

      e.preventDefault();
      if (this.distanceX > 20) {
        this.start = clientWidth - 20;
        this.setTranslate(20, this.clickedClass);
      }

      if (this.distanceX < 0) {
        this.start = clientWidth;
        this.setTranslate(0, this.clickedClass);
      }

      if (this.distanceX < 21 && this.distanceX > 0) {
        this.setTranslate(this.distanceX, this.clickedClass);
      }
    }
  }

  getScaleValue() {
    // Get the transform value from the clicked element (it is always the same).
    console.log('parent is', this.clickedClass.parentElement.parentElement.style);
    const scaleString = this.clickedClass.parentElement.parentElement.style.transform;
    // This is used to extract the value from scale: "scale(3)" becomes "3".
    const regex = /(?!scale\()\d(\.{0,1}\d+)|(\d)(?=\))/g;
    const regexResult = scaleString.match(regex);
    console.log(scaleString);
    // Get the value as a floating number.
    const scaleValue = regexResult.length > 0 ? parseFloat(regexResult[0]) : 1;

    // Apply the root zoom, if it exists.
    const rootScaledElement = document.getElementsByClassName('rootScale');
   
    if (rootScaledElement.length > 0 && rootScaledElement[0].style.transform) {
      const regexArr = rootScaledElement[0].style.transform.match(regex);
      if (regexArr.length > 0) {
        return scaleValue * parseFloat(regexArr[0]);
      }
    }

    return scaleValue;
  }

  dragCursor(e) {
    if (this.active) {
      e.preventDefault();
      if (
        this.distanceX == 0 &&
        (this.start == 0 || e.target.classList.contains('cl-toggle-js'))
      ) {
        this.switchOperation(!this.clickedClass.getAttribute('checked'));
      } else {
        this.switchOperation(this.distanceX > 10);
      }
      this.distanceX = 0;
      this.start = 0;
    }
    this.active = false;
  }

  switchOperation(isSwitchOn) {
    if (isSwitchOn) {
      this.setTranslate(20, this.clickedClass);
      this.clickedClass.setAttribute('checked', true);
      this.clickedClass.parentElement.classList.remove('switch-off');
      this.clickedClass.parentElement.classList.add('switch-on');
    } else {
      this.setTranslate(0, this.clickedClass);
      this.clickedClass.removeAttribute('checked');
      this.clickedClass.parentElement.classList.remove('switch-on');
      this.clickedClass.parentElement.classList.add('switch-off');
    }
  }

  setTranslate(xPos, el) {
    el.style.transform = `translate3d(${xPos}px, -50%, 0)`;
    el.style.transition = 'background-color 0.2s,transform 0.1s linear';
    if (this.distanceX == 0) {
      el.style.transition = 'background-color 0.2s,transform 0.3s ease-out';
    }
  }

  render() {
    return html`
    <div class="rootScale">
    <div class="cl-togglecomponent cl-togglecomponent-js" style="transform: scale(3);" @mousedown=${this.startCursor} @mousemove=${this.moveCursor} @mouseleave=${this.dragCursor}>
  <div class="cl-toggleswitch cl-toggleswitch-js" id="toggle-track">
    <input type="checkbox" id="toggle-id" />
    <div class="cl-toggle cl-toggle-js"></div>
  </div>
  </div>
</div>`;
  }
}

customElements.define('codelessly-toggle', ToggleComponent);
