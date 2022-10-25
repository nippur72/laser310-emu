"use strict";
const React = require("react");
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_3 = require("@fluentui/react");
const react_4 = require("@fluentui/react");
const react_5 = require("@fluentui/react");
const UploadButton_1 = require("./UploadButton");
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
let joystickOptions = [
    { key: 'A', text: 'Option A' },
    { key: 'B', text: 'Option B' },
    { key: 'C', text: 'Option C', disabled: true },
    { key: 'D', text: 'Option D' },
];
function _onChange(ev, option) {
    console.dir(option);
}
const numericalSpacingStackTokens = {
    childrenGap: 10,
    padding: 10,
};
class EmulatorGUI extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            machine: "vz300pal",
            memory: "18K",
            joystick_connected: true,
            showPreferences: false
        };
    }
    componentDidMount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    handleKeyDown(e) {
        let showPreferences = this.state.showPreferences;
        if (e.code == "F10") {
            // F10 toggle preferences window
            this.setState({ showPreferences: !showPreferences });
        }
        else if (e.code == "Escape") {
            // close preferences window if open
            if (showPreferences)
                this.close();
        }
        else {
            // console.log(e.code);
        }
    }
    close() {
        this.setState({ showPreferences: false });
    }
    buttonResetClick() {
        emulator.reset();
        this.close();
    }
    buttonCloseClick() {
        this.close();
    }
    handleUploadVZ(files) {
        emulator.droppedFiles(files);
        this.close();
    }
    handleUploadText(files) {
        emulator.droppedFiles(files);
        this.close();
    }
    handleChangeMachine(event, item) {
        if (item === undefined)
            return;
        let machineType = String(item.key);
        this.setState({ machine: machineType });
        emulator.setMachineType(machineType);
    }
    handleChangeMemory(event, item) {
        if (item === undefined)
            return;
        let memory = String(item.key);
        this.setState({ memory: memory });
        emulator.setMemory(memory);
    }
    handleChangeJoystickConnected(ev, isChecked) {
        let joyconn = isChecked == true;
        this.setState({ joystick_connected: joyconn });
        emulator.connectJoystick(joyconn);
    }
    render() {
        let state = this.state;
        return (React.createElement(react_3.Modal, { isOpen: state.showPreferences },
            React.createElement("div", { onKeyDown: (e) => this.handleKeyDown(e), style: { padding: '2em' } },
                React.createElement(react_2.Pivot, { style: { height: '500px' } },
                    React.createElement(react_2.PivotItem, { headerText: "Files", headerButtonProps: { 'data-order': 1 } },
                        React.createElement(react_2.Label, null, "Programs"),
                        React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "start", tokens: numericalSpacingStackTokens },
                            React.createElement(UploadButton_1.Uploader, { value: "Load VZ", onUpload: (e) => this.handleUploadVZ(e), accept: ".vz" }))),
                    React.createElement(react_2.PivotItem, { headerText: "CPU", headerButtonProps: { 'data-order': 2 } },
                        React.createElement(react_2.Dropdown, { label: "CPU", options: machineOptions, selectedKey: state.machine, onChange: (e, i) => this.handleChangeMachine(e, i) }),
                        React.createElement(react_2.Dropdown, { label: "Memory", options: memoryOptions, selectedKey: state.memory, onChange: (e, i) => this.handleChangeMemory(e, i) }),
                        React.createElement("div", null, "MC6847 snow: on/off")),
                    React.createElement(react_2.PivotItem, { headerText: "Joysticks", headerButtonProps: { 'data-order': 2 } },
                        React.createElement(react_5.Checkbox, { label: "Joystick interface connected", checked: state.joystick_connected, onChange: (e) => this.handleChangeJoystickConnected(e) }),
                        React.createElement(react_4.ChoiceGroup, { defaultSelectedKey: "B", options: joystickOptions, onChange: _onChange, label: "Pick one", required: true }),
                        ";"),
                    React.createElement(react_2.PivotItem, { headerText: "Tape", headerButtonProps: { 'data-order': 3 } },
                        React.createElement(UploadButton_1.Uploader, { value: "Load .WAV", onUpload: (f) => this.handleUploadVZ(f), accept: ".wav" }),
                        React.createElement("div", null, "Record file WAV"),
                        React.createElement("div", null, "Stop tape"),
                        React.createElement("div", null, "cassette audio: on/off")),
                    React.createElement(react_2.PivotItem, { headerText: "Disk", headerButtonProps: { 'data-order': 4 } },
                        React.createElement("div", null, "Disk drive interface on/off"),
                        React.createElement("div", null, "Load disk in drive 1"),
                        React.createElement("div", null, "Load disk in drive 2"),
                        React.createElement("div", null, "Download disk in drive 1"),
                        React.createElement("div", null, "Download disk in drive 2"),
                        React.createElement("div", null, "Unmount disk in drive 1"),
                        React.createElement("div", null, "Unmount disk in drive 2")),
                    React.createElement(react_2.PivotItem, { headerText: "Printer", headerButtonProps: { 'data-order': 5 } },
                        React.createElement("div", null, "Save printer output")),
                    React.createElement(react_2.PivotItem, { headerText: "Video", headerButtonProps: { 'data-order': 6 } },
                        React.createElement("div", null, "Brighness contrast saturation"),
                        React.createElement("div", null, "Monochrome output"),
                        React.createElement("div", null, "Take snapshot")),
                    React.createElement(react_2.PivotItem, { headerText: "Text files", headerButtonProps: { 'data-order': 7 } },
                        React.createElement(UploadButton_1.Uploader, { value: "Load text file", onUpload: (e) => this.handleUploadText(e), accept: ".txt,.bas" })),
                    React.createElement(react_2.PivotItem, { headerText: "About", headerButtonProps: { 'data-order': 8 } },
                        React.createElement(react_2.Label, null, "Laser 310 emulator, (C) 2021 Antonino Porcino"))),
                React.createElement(react_2.Stack, { horizontal: true, horizontalAlign: "space-between" },
                    React.createElement(react_2.DefaultButton, { onClick: () => this.buttonResetClick() }, "Reset CPU"),
                    React.createElement(react_2.PrimaryButton, { onClick: () => this.buttonCloseClick() }, "Close")))));
    }
}
module.exports = EmulatorGUI;
