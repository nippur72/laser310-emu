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
const EmulatorGUI_1 = __importDefault(require("./EmulatorGUI"));
let process = {};
const mountNode = document.getElementById("mountnode");
react_dom_1.render(react_1.createElement(EmulatorGUI_1.default), mountNode);
