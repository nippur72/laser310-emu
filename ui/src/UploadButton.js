"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploader = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@fluentui/react");
function Uploader(props) {
    const inputElementRef = react_1.useRef(null);
    function onChange() {
        var _a;
        const files = (_a = inputElementRef.current) === null || _a === void 0 ? void 0 : _a.files;
        if (!files)
            return;
        if (props.onUpload)
            props.onUpload(files);
    }
    function showDialog() {
        var _a;
        (_a = inputElementRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }
    return (react_1.default.createElement("span", null,
        react_1.default.createElement("input", { type: "file", ref: inputElementRef, style: { display: "none" }, onChange: onChange, accept: props.accept }),
        react_1.default.createElement(react_2.DefaultButton, { onClick: showDialog }, props.value)));
}
exports.Uploader = Uploader;
