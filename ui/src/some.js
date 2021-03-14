"use strict";
const React = require("react");
const react_1 = require("@fluentui/react");
const react_2 = require("@fluentui/react");
let machineOptions = [
    { key: "vz200pal", text: "VZ200 (Laser 210) PAL" },
    { key: "vz300pal", text: "VZ300 (Laser 310) PAL" },
    { key: "vz200ntsc", text: "VZ200 (Laser 210) NTSC" },
    { key: "vz300ntsc", text: "VZ300 (Laser 310) NTSC" }
];
let memoryOptions = [
    { key: "8K", text: "8K RAM" },
    { key: "18K", text: "18K RAM" },
    { key: "24K", text: "24K RAM" },
    { key: "34K", text: "34K RAM" }
];
const numericalSpacingStackTokens = {
    childrenGap: 10,
    padding: 10,
};
class Some extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showPreferences: false,
            machine: 'vz300pal',
            memory: "18K"
        };
        this.togglePreferences = () => {
            this.setState({ showPreferences: !this.state.showPreferences });
        };
        this.handleKeyDown = (e) => {
            if (e.code == "F10") {
                // F10 toggle preferences window         
                this.togglePreferences();
            }
            else if (e.code == "Escape") {
                // close preferences window if open
                if (this.state.showPreferences)
                    this.close();
            }
            else {
                // console.log(e.code);
            }
        };
        this.handleUpload = (files) => {
            emulator.droppedFiles(files);
            this.close();
        };
        this.handleChangeMachine = (event, item) => {
            if (item === undefined)
                return;
            let machineType = String(item.key);
            this.setState({ machine: machineType });
            emulator.setMachineType(machineType);
        };
        this.handleChangeMemory = (event, item) => {
            if (item === undefined)
                return;
            let memory = String(item.key);
            this.setState({ memory });
            emulator.setMemory(String(memory));
        };
    }
    close() {
        this.setState({ showPreferences: false });
    }
    componentDidMount() {
        //document.addEventListener('emu-f10', this.togglePreferences);      
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        //document.removeEventListener('emu-f10', this.togglePreferences, false);      
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }
    buttonResetClick() {
        emulator.reset();
    }
    buttonCloseClick() {
        this.close();
    }
    render() {
        return (React.createElement(react_2.Modal, { isOpen: this.state.showPreferences },
            React.createElement("div", { onKeyDown: this.handleKeyDown, style: { padding: '2em' } },
                React.createElement(react_1.Pivot, { style: { height: '500px' } },
                    React.createElement(react_1.PivotItem, { headerText: "Files", headerButtonProps: { 'data-order': 1 } },
                        React.createElement(react_1.Label, null, "Programs"),
                        React.createElement(react_1.Stack, { horizontal: true, horizontalAlign: "start", tokens: numericalSpacingStackTokens },
                            React.createElement(UploadButton, { value: "Load VZ", onUpload: this.handleUpload, accept: ".vz" }),
                            React.createElement(react_1.DefaultButton, { onClick: () => { }, disabled: true }, "Save VZ"))),
                    React.createElement(react_1.PivotItem, { headerText: "Machine", headerButtonProps: { 'data-order': 2 } },
                        React.createElement(react_1.Dropdown, { label: "Machine", options: machineOptions, selectedKey: this.state.machine, onChange: this.handleChangeMachine }),
                        React.createElement(react_1.Dropdown, { label: "Memory", options: memoryOptions, selectedKey: this.state.memory, onChange: this.handleChangeMemory }),
                        React.createElement("div", null, "MC6847 snow: on/off"),
                        React.createElement("div", null, "joystick emulation: off/numpad/cursor keys")),
                    React.createElement(react_1.PivotItem, { headerText: "Tape", headerButtonProps: { 'data-order': 3 } },
                        React.createElement(UploadButton, { value: "Load .WAV", onUpload: this.handleUpload, accept: ".wav" }),
                        React.createElement("div", null, "Record file WAV"),
                        React.createElement("div", null, "Stop tape"),
                        React.createElement("div", null, "cassette audio: on/off")),
                    React.createElement(react_1.PivotItem, { headerText: "Disk", headerButtonProps: { 'data-order': 4 } },
                        React.createElement("div", null, "Disk drive interface on/off"),
                        React.createElement("div", null, "Load disk in drive 1"),
                        React.createElement("div", null, "Load disk in drive 2"),
                        React.createElement("div", null, "Download disk in drive 1"),
                        React.createElement("div", null, "Download disk in drive 2"),
                        React.createElement("div", null, "Unmount disk in drive 1"),
                        React.createElement("div", null, "Unmount disk in drive 2")),
                    React.createElement(react_1.PivotItem, { headerText: "Printer", headerButtonProps: { 'data-order': 5 } },
                        React.createElement("div", null, "Save printer output")),
                    React.createElement(react_1.PivotItem, { headerText: "Video", headerButtonProps: { 'data-order': 6 } },
                        React.createElement("div", null, "Brighness contrast saturation"),
                        React.createElement("div", null, "Monochrome output"),
                        React.createElement("div", null, "Take snapshot")),
                    React.createElement(react_1.PivotItem, { headerText: "Text files", headerButtonProps: { 'data-order': 7 } },
                        React.createElement("div", null, "Load text file"),
                        React.createElement("div", null, "Paste clipboard text")),
                    React.createElement(react_1.PivotItem, { headerText: "About", headerButtonProps: { 'data-order': 8 } },
                        React.createElement(react_1.Label, null, "Laser 310 emulator, (C) 2021 Antonino Porcino"))),
                React.createElement(react_1.Stack, { horizontal: true, horizontalAlign: "space-between" },
                    React.createElement(react_1.DefaultButton, { onClick: () => this.buttonResetClick() }, "Reset CPU"),
                    React.createElement(react_1.PrimaryButton, { onClick: () => this.buttonCloseClick() }, "Close")))));
    }
}
class UploadButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleButtonClick = () => {
            var _a;
            (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.click();
        };
        this.handleInputChange = () => {
            var _a;
            let files = (_a = this.inputRef.current) === null || _a === void 0 ? void 0 : _a.files;
            if (!files)
                return;
            this.props.onUpload(files);
        };
        this.inputRef = React.createRef();
    }
    render() {
        return (React.createElement("span", null,
            React.createElement("input", { type: "file", ref: this.inputRef, style: { display: "none" }, onChange: this.handleInputChange, accept: this.props.accept }),
            React.createElement(react_1.DefaultButton, { onClick: this.handleButtonClick }, this.props.value)));
    }
}
module.exports = Some;
