/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { LitElement, html, css } from 'https://cdn.skypack.dev/lit@2.8.0';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class CodelesslySlider extends LitElement {
    static get styles() {
        return css `
      .cl-carousel-wrapper {
          width: 350px;
          height: 200px;
          margin: 0 auto;
          overflow: hidden;
      }
      
      .cl-slides {
          height: 350px;
      /*     transition: transform 0.7s cubic-bezier(0.4, 0, 0.14, 1); */
      }
      
      .slide {
          width: 350px;
          height: 200px;
          float: left;
          position: relative;
      }
      
      .slide>span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: inline-block;
          padding: 5px 10px;
          background: #fff;
          border-radius: 4px;
          color: #000;
          min-width: 50px;
          text-align: center;
          z-index: 3;
        cursor: pointer;
      }
      
      .cl-slides>.slide:nth-of-type(1) {
          background: #03a9f4;
      }
      
      .cl-slides>.slide:nth-of-type(2) {
          background: #ff5722;
      }
      
      .cl-slides>.slide:nth-of-type(3) {
          background: #ffeb3b;
      }
      
      .cl-slides>.slide:nth-of-type(4) {
          background: #4caf50;
      }
      
      .cl-slides>.slide:nth-of-type(5) {
          background: #795548;
      }
      .cl-slides>.slide:nth-of-type(6) {
          background: #03a9f4;
      }
      
      .cl-slides>.slide:nth-of-type(7) {
          background: #ff5722;
      }
      
      .cl-slides>.slide:nth-of-type(8) {
          background: #ffeb3b;
      }
      
      .cl-slides>.slide:nth-of-type(9) {
          background: #4caf50;
      }
      
      .cl-slides>.slide:nth-of-type(10) {
          background: #795548;
      }
      
    `;
    }
    static get properties() {
        return {
            /**
             * The name to say "Hello" to.
             * @type {string}
             */
            name: { type: String },

            /**
             * The number of times the button has been clicked.
             * @type {number}
             */
            count: { type: Number },
        };
    }

    constructor() {
        super();
    }
    component;
    wrapper;
    wrappers;
    wrapper_width;
    pointer_is_down = false;
    start_x = 0;
    start_y = 0;
    move_distance = 0;
    current_slide = 0;
    clickedSlide;

    firstUpdated(updatedProps) {
        console.log("component first update trigger");
        this.component = document.querySelector('codelessly-carousel')
        this.wrapper = this.shadowRoot.querySelector(".cl-carousel-wrapper");
        this.wrappers = this.shadowRoot.querySelectorAll(".cl-carousel-wrapper");
        this.wrapper_width = this.wrapper.clientWidth;
        for (let i = 0; i < this.wrappers.length; i++) {
            const childWrapper = this.wrappers[i].querySelectorAll(".slide").length;
            this.wrappers[i].querySelector(".cl-slides").style.width = `${
      this.wrappers[i].clientWidth * childWrapper
    }px`;
        }

    }


    // Mousemove and Touchmove Event
    createDraggingEffects = function(ele) {
        const movedDistance = this.start_x - this.end_x;
        if (movedDistance < 0) {
            this.scrollDistance = this.current_slide - Math.abs(movedDistance);
        } else {
            this.scrollDistance = this.current_slide + movedDistance;
        }
        this.switchSlides(this.scrollDistance, ele);
    }
    getSliderScaleValue = function() {

            // Get the transform value from the clicked element (it is always the same).
            //console.log(this.clickedSlide.parentElement);
            const scaleString = this.clickedSlide.parentElement.style.transform;

            //console.log(scaleString);

            let scaleValue = 1;
            if (scaleString == "") {
                return scaleValue;
            }
            // This is used to extract the value from scale: "scale(3)" becomes "3".
            const regex = /(?!scale\()\d+(?=\))/g;
            const regexResult = scaleString.match(regex);

            // Get the value as a floating number.
            scaleValue = (regexResult.length > 0) ? parseFloat(regexResult[0]) : 1;

            // Apply the root zoom, if it exists.
            const rootScaledElement = document.getElementsByClassName("rootZoom");
            if (rootScaledElement.length > 0 && rootScaledElement[0].style.transform) {
                const regexArr = rootScaledElement.style.transform.match(regex);
                if (regexArr.length > 0) {
                    return scaleValue * parseFloat(regexArr[0]);
                }
            }

            return scaleValue;
        }
        // Mouseup and Touchend Event
    calculateFinalMoveDistance = function(ele) {
        const scrolled_distance = this.start_x - this.end_x;
        const nextSlide = 30;
        const preSlide = -30;

        ele.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.14, 1)";
        console.log("calFinalMovDis", nextSlide, scrolled_distance, preSlide, nextSlide < scrolled_distance > preSlide)
        if (nextSlide < scrolled_distance > preSlide) {
            this.switchSlides(this.current_slide, ele);
        }

        if (scrolled_distance > nextSlide) {
            this.move_distance = this.current_slide + this.wrapper_width;
            if (this.move_distance < ele.clientWidth) {
                this.switchSlides(this.move_distance, ele);
            }
        }

        if (scrolled_distance < preSlide) {
            this.move_distance = this.current_slide - this.wrapper_width;
            if (this.current_slide > 0) {
                this.switchSlides(this.move_distance, ele);
            }
        }
    }

    // Switch Slides
    switchSlides = function(scrolled_number, ele) {
        const distance = -scrolled_number;
        ele.style.transform = `translateX(${distance}px)`;
        console.log(ele.style.transform);
    }

    // Mouseleave event
    handleMouseLeave = function(e) {
        const ele = this.shadowRoot;
        if (!this.pointer_is_down) return false;
        this.pointer_is_down = false;
        this.calculateFinalMoveDistance(ele.querySelector(".cl-slides"));
    }


    findTranslate = function(ele) {
        const matrix = new DOMMatrix(ele.style.transform);
        this.current_width = matrix ? matrix.m41 : ele.clientWidth;
        this.current_slide = Math.abs(this.current_width);
        console.log("translate", ele);
    }

    dragStart = function(e) {
        const ele = this.shadowRoot;
        const childEle = ele.querySelector(".cl-slides");
        this.clickedSlide = childEle;
        const scaleValue = this.getSliderScaleValue();
        childEle.style.transition = "transform 0s linear";
        this.findTranslate(childEle);
        this.pointer_is_down = true;
        if (e.type == "touchstart") {
            this.start_x = e.touches[0].clientX / scaleValue;
        } else {
            this.start_x = e.clientX / scaleValue;
        }
    }

    dragMove = function(e) {
        //console.log("dragMove",e.target);
        e.preventDefault();
        const ele = this.shadowRoot;
        //console.log("move",ele);
        const childEle = ele.querySelector(".cl-slides");
        this.clickedSlide = childEle;
        const scaleValue = this.getSliderScaleValue();
        e.preventDefault();
        if (!this.pointer_is_down) return false;
        if (e.type == "touchmove") {
            console.log(e.changedTouches[0].clientX, "clientX")
            this.end_x = e.changedTouches[0].clientX / scaleValue;
        } else {
            console.log("dragMove", e.clientX);
            this.end_x = e.clientX / scaleValue;
        }
        this.createDraggingEffects(ele.querySelector(".cl-slides"));
    }

    dragEnd = function(e) {
            e.preventDefault();
            const ele = this.shadowRoot;
            const childEle = ele.querySelector(".cl-slides");
            this.clickedSlide = childEle;
            const scaleValue = this.getSliderScaleValue();
            this.pointer_is_down = false;
            if (e.type == "touchend") {
                this.end_x = e.changedTouches[0].clientX / scaleValue;
            } else {
                this.end_x = e.clientX / scaleValue;
            }
            this.calculateFinalMoveDistance(ele.querySelector(".cl-slides"));
        }
        //@mouseleave=${this.handleMouseLeave} @mouseup=${this.dragEnd} @mousemove=${this.dragMove}
    render() {
        return html `
      <div class="cl-carousel-wrapper" @mouseup=${this.dragEnd} @mousemove=${this.dragMove} @mouseleave=${this.handleMouseLeave} @mousedown=${this.dragStart}>
        <div id="slides" class="cl-slides">
          <span class="slide"><span>1</span></span>
          <span class="slide"><span>2</span></span>
          <span class="slide"><span>3</span></span>
          <span class="slide">
            <span>4</span>
          </span>
          <span class="slide">
            <span>4</span>
          </span>
          <span class="slide">
            <span>4</span>
          </span>
          <span class="slide"><span>last</span></span>
        </div>
      </div>
    `;
    }

}

window.customElements.define('codelessly-carousel', CodelesslySlider);