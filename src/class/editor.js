import { RENDER } from "../main";
import EventManager from "events";

import html2md from "html-to-md";
import { marked } from "marked";

export default class Editor {
    constructor() {
        this.current_element = null;
        this.index = 0;
        this.container = null;

        this.base_input = document.querySelector("#input");

        this.new_line = this.new_line.bind(this);
        this.active_button = this.active_button.bind(this);
        this.destructor = this.destructor.bind(this);

        this.base_input.addEventListener("keyup", this.adjust_textarea);
    }

    get_element_index(el) {
        let parent_childs = Array.from(el.parentNode.children);
        return parent_childs.indexOf(el);
    }

    adjust_textarea(el) {
        let textarea = el.target;
        textarea.style.height = "1px";
        textarea.style.height = ( 10 + textarea.scrollHeight ) + "px";
    }

    create_input(el) {
        this.index = this.get_element_index(el);

        this.current_element = document.createElement("textarea");
        this.current_element.value = html2md(el.outerHTML);
        this.current_element.style.height = ( 25 + this.current_element.scrollHeight ) + "px";

        this.current_element.addEventListener("keyup", this.adjust_textarea);

        this.container = document.createElement("div");
        this.container.appendChild(this.current_element);

        el.replaceWith(this.container);
    }

    active_button() {
        let new_element = document.createElement("p");
        new_element.innerHTML = marked.parse(this.current_element.value);

        this.container.replaceWith(new_element);

        this.destructor();
    }

    new_line() {
        if ( this.base_input.value === null || this.base_input.value === "" ) {
            return
        }

        let new_element = document.createElement("span");
        new_element.innerHTML = marked.parse(this.base_input.value);

        RENDER.appendChild(new_element);

        this.base_input.value = null;
        this.base_input.scrollHeight = "0";
        this.base_input.height = "1px";
        this.base_input.height = ( 10 + this.base_input.scrollHeight ) + "px";
    }

    destructor() {
        this.current_element = null;
        this.index = 0;
        this.container = null;
    }
}
