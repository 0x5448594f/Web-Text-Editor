import { RENDER } from "../main";
import EventManager from "./events";
import Buttons from "./buttons";

import html2md from "html-to-md";
import { marked } from "marked";

export default class Editor {
    constructor() {
        this.current_element = null;
        this.index = 0;

        this.base_input = document.querySelector("#input");

        this.new_line = this.new_line.bind(this);
        this.active_button = this.active_button.bind(this);
        this.clear = this.clear.bind(this);

        this.buttons = new Buttons(this);

        this.base_input.addEventListener("keyup", this.adjust_textarea);
    }

    adjust_textarea(el) {
        let textarea = el.target;
        textarea.style.height = "1px";
        textarea.style.height = ( 10 + textarea.scrollHeight ) + "px";
    }

    get_element_index(el) {
        let parent_childs = Array.from(el.parentNode.children);
        return parent_childs.indexOf(el);
    }

    create_input(el, cursor_pos) {
        this.index = this.get_element_index(el);

        this.current_element = document.createElement("textarea");
        this.current_element.value = html2md(el.outerHTML);
        this.current_element.style.height = ( 25 + this.current_element.scrollHeight ) + "px";

        this.current_element.addEventListener("keyup", this.adjust_textarea);

        el.replaceWith(this.current_element);

        requestAnimationFrame(() => {
            this.current_element.focus();
            this.current_element.setSelectionRange(cursor_pos, cursor_pos);
        }, 0);
    }

    active_button() {
        let new_element = document.createElement("div");
        new_element.innerHTML = marked.parse(this.current_element.value);

        this.current_element.replaceWith(new_element);

        this.clear();

        localStorage.setItem("article", RENDER.innerHTML);
    }

    new_line() {
        if ( this.base_input.value === null || this.base_input.value === "" ) {
            return
        }

        let new_element = document.createElement("div");
        new_element.innerHTML = marked.parse(this.base_input.value);

        RENDER.appendChild(new_element);

        this.base_input.value = null;
        this.base_input.height = "1px";
        this.base_input.height = ( 10 + this.base_input.scrollHeight ) + "px";

        localStorage.setItem("article", RENDER.innerHTML);
    }

    clear() {
        this.current_element = null;
        this.index = 0;
        this.container = null;

        this.buttons.clear();
    }
}
