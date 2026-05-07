import EventManager from "./class/events";
import Editor from "./class/editor";

import { marked } from "marked";

import "./style.css";

export const RENDER = document.querySelector(".render");
export const BUTTONS_CONTAINER = document.querySelector(".buttons");

let storage = localStorage.getItem("article");

if ( storage ) {
    RENDER.innerHTML = storage;
}

let editor = new Editor();
let event_manager = new EventManager(editor);
