import { createElement } from "react";
import { render } from "react-dom";

import { initializeIcons } from "@fluentui/react";

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons();

// ...or, register icons and pull the fonts from your own cdn:
//initializeIcons('https://my.cdn.com/path/to/icons/');

import Some from "./some";

let process = {};

const mountNode = document.getElementById("mountnode");
console.log(mountNode);

const props = {};

render(createElement(Some, props), mountNode);
