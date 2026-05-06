import EventManager from "./class/events";
import Editor from "./class/editor";

import { marked } from "marked";

import "./style.css";

export const RENDER = document.querySelector(".render");

let storage = localStorage.getItem("monChat");

if ( storage ) {
    RENDER.innerHTML = storage;
}

let editor = new Editor();
let event_manager = new EventManager(editor);
