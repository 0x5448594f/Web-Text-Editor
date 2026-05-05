import EventManager from "./class/events";
import Editor from "./class/editor";

import "./style.css";

export const RENDER = document.querySelector(".render");

let editor = new Editor();
let event_manager = new EventManager(editor);
