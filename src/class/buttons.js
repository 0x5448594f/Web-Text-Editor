import { RENDER } from "../main";

import html2md from "html-to-md";
import { marked } from "marked";

export default class Buttons {
    constructor(editor) {
        this.editor = editor;
        this.title_value = null;

        this.bold_button = document.querySelector(".bold_button");
        this.italic_button = document.querySelector(".italic_button");
        this.code_button = document.querySelector(".code_button");
        this.title_button = document.querySelector(".title_button");
        this.line_button = document.querySelector(".line_button");
        this.file_input = document.querySelector(".file_button");
        this.valid_input = document.querySelector(".valid");

        this.append_markdown_balise = this.append_markdown_balise.bind(this);
        this.title = this.title.bind(this);
        this.clear = this.clear.bind(this);
        this.change_title_value = this.change_title_value.bind(this);
        this.determine_title_value = this.determine_title_value.bind(this);
        this.clear_hashtag = this.clear_hashtag.bind(this);
        this.jump_line = this.jump_line.bind(this);
        this.add_image = this.add_image.bind(this);

        this.bold_button.addEventListener("click", () => this.append_markdown_balise("**"));
        this.italic_button.addEventListener("click", () => this.append_markdown_balise("*"));
        this.code_button.addEventListener("click", () => this.append_markdown_balise("`"));
        this.title_button.addEventListener("click", this.title);
        this.line_button.addEventListener("click", this.jump_line);
        this.file_input.addEventListener("change", this.add_image);

        this.valid_input.addEventListener("click", () => navigator.clipboard.writeText(RENDER.innerHTML))
    }

    append_markdown_balise(balise) {
        let textarea;

        if ( this.editor.current_element ) {
            textarea = this.editor.current_element;
        } else if ( this.editor.base_input ) {
            textarea = this.editor.base_input;
        } else return

        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;

        let selection = textarea.value.substring(start, end);
        if ( !selection ) return

        let v  = textarea.value;
        textarea.value = v.slice(0, start) + balise + v.slice(start, end) + balise + v.slice(end, v.length);
    }

    jump_line() {
        let textarea;

        if ( this.editor.current_element ) {
            textarea = this.editor.current_element;
        } else if ( this.editor.base_input ) {
            textarea = this.editor.base_input;
        } else return

        let start = textarea.selectionStart;

        let v = textarea.value;
        textarea.value = v.slice(0, start) + "<br />" + v.slice(start, v.length);
    }


    title() {
        let is_base_input = true;

        let textarea;
        if ( this.editor.current_element ) {
            textarea = this.editor.current_element;
            is_base_input = false;
        } else if ( this.editor.base_input ) {
            textarea = this.editor.base_input;
        } else return;

        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        let selection = textarea.value.substring(start, end);
        if ( selection === " " ) return

        if ( !selection ) {
            if ( textarea.value[0] === "#" ) { // Determine if it's already a title
                if ( this.title_value === null ) {
                    this.determine_title_value(textarea.value);
                }

                this.change_title_value(textarea)
            } else {
                textarea.value = "## " + textarea.value;
            }

            return
        }

        let next_element_value = textarea.value.slice(0, start) + textarea.value.slice(end, textarea.value.length);
        let new_element = document.createElement("p");

        if ( !is_base_input ) {
            new_element.innerHTML = marked.parse(next_element_value);

            if ( new_element.innerText.length > 1 ) {
                RENDER.insertBefore(new_element, RENDER.children[this.editor.index+1])
            }

            this.change_title_value(textarea, selection)
        } else {
            new_element.innerHTML = marked.parse("# " + selection);
            textarea.value = next_element_value;

            RENDER.insertBefore(new_element, null)
        }
    }

    determine_title_value(value) {
        let index = value.lastIndexOf("#");

        this.title_value = index === 1 ? 0 : 1;

        return index;
    }

    change_title_value(textarea, optional_selection) {
        let selection = optional_selection;

        if ( !selection ) {
            selection = this.clear_hashtag(textarea.value).trim();
        }

        if ( this.title_value === 1 ) {
            textarea.value = "## " + selection
            this.title_value = 0;
        } else {
            textarea.value = "# " + selection
            this.title_value = 1;
        }
    }

    clear_hashtag(value) {
        let index = this.determine_title_value(value);

        return value.slice(index+1, value.length);
    }

    add_image(e) {
        let file = e.target.files[0];
        let src = this.createObjectURL(file);

        let image = document.createElement("img");
        image.src = src;

        RENDER.appendChild(image);
    }

    createObjectURL(object) {
        return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
    }

    clear() {
        this.title_value = null;
    }
}
