import { createElement } from "react";
import { render } from "react-dom";

import Some from "./some";

let process = {};

const mountNode = document.getElementById("mountnode");
console.log(mountNode);

const props = {};

render(createElement(Some, props), mountNode);
