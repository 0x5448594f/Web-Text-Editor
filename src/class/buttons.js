export default class Buttons {
    constructor(editor) {
        this.editor = editor;
        this.bold_button = document.querySelector(".bold_button");

        this.bold = this.bold.bind(this);

        this.bold_button.addEventListener("click", this.bold);
    }

    bold() {
        let start;
        let end;

        if ( this.editor.current_element ) {
            start = this.editor.current_element.selectionStart;
            end = this.editor.current_element.selectionEnd;


            let selection = this.editor.current_element.value.substring(start, end);
            if ( !selection ) return

            this.append_element(this.editor.current_element, "**", start, end);
        } else if ( this.editor.base_input ) {
            start = this.editor.base_input.selectionStart;
            end = this.editor.base_input.selectionEnd;

            let selection = this.editor.base_input.value.substring(start, end);
            if ( !selection ) return

            this.append_element(this.editor.base_input, "**", start, end);
        } else {
            return
        }
    }

    append_element(element, value, start, end) {
        let v = element.value;

        element.value = v.slice(0, start) + value + v.slice(start, end) + value + v.slice(end, v.length);
    }
}
