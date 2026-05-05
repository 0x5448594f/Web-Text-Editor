import { RENDER } from "../main";

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
    }

    trigger_mouse(mouse) {
        if ( !RENDER.contains(mouse.target) ) return

        this.trigger = mouse.target;
        this.parent = this.get_parent(this.trigger);
        let cursor_pos = this.get_cursor_pos(mouse);

        if ( !this.editor.current_element ) {
            this.editor.create_input(this.parent, cursor_pos);
        }
    }

    trigger_enter(e) {
        console.log(e.key);

        switch(e.key) {
            case "Enter":
                e.preventDefault();

                if ( this.editor.current_element !== null && this.editor.button !== null ) {
                    this.editor.active_button();
                } else if ( this.editor.base_input.value !== null || this.editor.base_input.value !== "" ) {
                    this.editor.new_line();
                }
                break;

            case "Backspace":
                if ( this.editor.current_element && this.editor.current_element.value === "" ) {
                    RENDER.removeChild(this.editor.current_element);
                    this.editor.clear();
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
