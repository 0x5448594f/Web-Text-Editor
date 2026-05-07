import { RENDER, BUTTONS_CONTAINER } from "../main";

export default class EventManager {

    constructor(editor) {
        this.trigger = null;
        this.parent = null;

        this.editor = editor;

        this.trigger_mouse = this.trigger_mouse.bind(this);
        this.trigger_enter = this.trigger_enter.bind(this);
        this.get_parent = this.get_parent.bind(this);

        window.addEventListener("mousedown", this.trigger_mouse);
        window.addEventListener("keydown", this.trigger_enter);
        document.querySelector("#input").addEventListener("focus", () => this.editor.active_button())
    }

    trigger_mouse(mouse) {
        if ( BUTTONS_CONTAINER.contains(mouse.target) ) return

        this.trigger = mouse.target;
        this.parent = this.get_parent(this.trigger);

        if ( this.parent === null ) return;
        
        let cursor_pos = this.get_cursor_pos(mouse);


        if ( this.editor.current_element && !RENDER.contains(this.trigger) ) {
            this.editor.active_button();
            return;
        }

        if ( this.parent.localName === "img" ) {
            RENDER.removeChild(this.parent);
            return;
        }

        if ( !this.editor.current_element ) {
            this.editor.create_input(this.parent, cursor_pos);
        } else if ( this.editor.current_element !== this.parent ) {
            this.editor.active_button();
            this.editor.create_input(this.parent, cursor_pos);
        }
    }

    trigger_enter(e) {
        switch(e.key) {
            case "Enter":
                e.preventDefault();

                if ( this.editor.current_element !== null && this.editor.button !== null ) {
                    let textarea = this.editor.current_element;
                    let cursor_pos = textarea.selectionStart;
                    let remnant_words = textarea.value.slice(cursor_pos, textarea.value.length);

                    textarea.value = textarea.value.slice(0, cursor_pos);

                    let new_line = document.createElement("p");
                    new_line.innerText = remnant_words;

                    RENDER.insertBefore(new_line, RENDER.children[this.editor.index+1]);
                    this.editor.active_button();

                    this.editor.create_input(new_line, 0);
                } else if ( this.editor.base_input.value !== null || this.editor.base_input.value !== "" ) {
                    this.editor.new_line();
                }
                break;

            case "Backspace":
                if ( this.editor.current_element && this.editor.current_element.value === "" ) {
                    let prev_element = RENDER.children[this.editor.index-1];

                    RENDER.removeChild(this.editor.current_element);
                    this.editor.clear();

                    if ( prev_element.localName === "img" ) return

                    this.editor.create_input(prev_element, prev_element.innerText.length);
                } else if ( this.editor.current_element && this.editor.current_element.value !== "" ) {
                    let textarea = this.editor.current_element; 
                    let cursor_pos = textarea.selectionStart;

                    if ( cursor_pos !== 0 ) return

                    let prev_element = RENDER.children[this.editor.index-1];
                    let new_cursor_pos = prev_element.innerText.length;
                    prev_element.innerText = prev_element.innerText + textarea.value;

                    RENDER.removeChild(textarea);
                    this.editor.clear();

                    if ( prev_element.localName === "img" ) return

                    this.editor.create_input(prev_element, new_cursor_pos);
                }
                break

            default:
                break
        }
    }

    get_parent(el) {
        let parent = el.parentNode;

        if ( parent === null ) {
            return null
        } else if ( parent === RENDER) {
            return el
        } else{
            parent = this.get_parent(parent);

            return parent;
        }
    }

    get_cursor_pos(mouse) {
        let selection = window.getSelection();
        let range = document.caretRangeFromPoint(mouse.clientX, mouse.clientY);

        return range.startOffset;
    }
}
