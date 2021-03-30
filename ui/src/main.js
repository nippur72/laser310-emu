"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const react_2 = require("@fluentui/react");
// Register icons and pull the fonts from the default SharePoint cdn.
react_2.initializeIcons();
// ...or, register icons and pull the fonts from your own cdn:
//initializeIcons('https://my.cdn.com/path/to/icons/');
const some_1 = __importDefault(require("./some"));
let process = {};
const mountNode = document.getElementById("mountnode");
console.log(mountNode);
const props = {};
react_dom_1.render(react_1.createElement(some_1.default, props), mountNode);
