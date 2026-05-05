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
        this.trigger = mouse.target;
        this.parent = this.get_parent(this.trigger);

        let no_base_trigger = this.trigger !== this.editor.base_input && this.trigger !== this.editor.base_button;

        if ( this.editor.current_element === null && no_base_trigger ) {
            this.editor.create_input(this.parent);
        }
    }

    trigger_enter(e) {

        switch(e.key) {
            case "Enter":
                e.preventDefault();

                if ( this.editor.current_element !== null && this.editor.button !== null ) {
                    this.editor.active_button();
                } else if ( this.editor.base_input.value !== null || this.editor.base_input.value !== "" ) {
                    this.editor.new_line();
                }
                break;

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
}
