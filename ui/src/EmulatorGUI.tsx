import React = require("react");
import { Component } from "react";

import { PrimaryButton, DefaultButton, Dropdown, IDropdownOption, Pivot, PivotItem, Label, Stack, IStackTokens } from '@fluentui/react';
import { Modal } from "@fluentui/react";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react";
import { Checkbox } from "@fluentui/react";

import { IEmulator } from "./emulator";
import { Uploader } from "./UploadButton";

declare var emulator: IEmulator;

let machineOptions: IDropdownOption<any>[] = [
   { key: "vz200pal" , text: "VZ200 (Laser 210) PAL"  },
   { key: "vz300pal" , text: "VZ300 (Laser 310) PAL"  },
   { key: "vz200ntsc", text: "VZ200 (Laser 210) NTSC" },
   { key: "vz300ntsc", text: "VZ300 (Laser 310) NTSC" }
];

let memoryOptions: IDropdownOption<any>[] = [
   { key: "8K"  , text: "8K RAM"  },
   { key: "18K" , text: "18K RAM" },
   { key: "24K" , text: "24K RAM" },
   { key: "34K" , text: "34K RAM" }
];

let joystickOptions: IChoiceGroupOption[] = [
   { key: 'A', text: 'Option A' },
   { key: 'B', text: 'Option B' },
   { key: 'C', text: 'Option C', disabled: true },
   { key: 'D', text: 'Option D' },
];

function _onChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption | undefined): void {
   console.dir(option);
}

const numericalSpacingStackTokens: IStackTokens = {
   childrenGap: 10,
   padding: 10,
};

interface State {
   machine: string;
   memory: string;
   joystick_connected: boolean;
   showPreferences: boolean;
}

class EmulatorGUI extends Component<State> {

   state: State = {
      machine: "vz300pal",
      memory: "18K",
      joystick_connected: true,
      showPreferences: false
   };

   componentDidMount() {
      document.addEventListener('keydown', (e)=>this.handleKeyDown(e));
   }

   handleKeyDown(e: any) {
      let showPreferences = this.state.showPreferences;

      if(e.code == "F10") {
         // F10 toggle preferences window
         this.setState({ showPreferences: !showPreferences });
      }
      else if(e.code == "Escape") {
         // close preferences window if open
         if(showPreferences) this.close();
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

   handleUploadVZ(files: FileList) {
      emulator.droppedFiles(files);
      this.close();
   }

   handleUploadText(files: FileList) {
      emulator.droppedFiles(files);
      this.close();
   }

   handleChangeMachine(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined) {
      if(item===undefined) return;
      let machineType = String(item.key);
      this.setState({machine: machineType});
      emulator.setMachineType(machineType);
   }

   handleChangeMemory(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined) {
      if(item===undefined) return;
      let memory = String(item.key);
      this.setState({memory: memory});
      emulator.setMemory(memory);
   }

   handleChangeJoystickConnected(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, isChecked?: boolean) {
      let joyconn = isChecked==true;
      this.setState({joystick_connected: joyconn});
      emulator.connectJoystick(joyconn);
   }

   render() {
      let state = this.state;
      return (
      <Modal isOpen={state.showPreferences}>
         <div onKeyDown={(e)=>this.handleKeyDown(e)} style={{padding: '2em'}}>
            <Pivot style={{height: '500px'}}>

               <PivotItem headerText="Files" headerButtonProps={{'data-order': 1}}>
                  <Label>Programs</Label>
                  <Stack horizontal horizontalAlign="start" tokens={numericalSpacingStackTokens}>
                     <Uploader value="Load VZ" onUpload={(e)=>this.handleUploadVZ(e)} accept=".vz" />
                     {/*<DefaultButton onClick={()=>{}} disabled={true}>Save VZ</DefaultButton>*/}
                  </Stack>
                  {/*
                  <DefaultButton onClick={()=>{}} disabled={true}>Download BINARY memory area</DefaultButton>
                  <UploadButton value="Load cart" onUpload={this.handleUpload} accept=".bin" />
                  <div>Remove cart</div>
                  <div>Load ROM</div>
                  */}
               </PivotItem>

               <PivotItem headerText="CPU" headerButtonProps={{'data-order': 2}}>
                  <Dropdown label="CPU" options={machineOptions} selectedKey={state.machine} onChange={(e,i)=>this.handleChangeMachine(e,i)} />
                  <Dropdown label="Memory" options={memoryOptions} selectedKey={state.memory} onChange={(e,i)=>this.handleChangeMemory(e,i)} />
                  <div>MC6847 snow: on/off</div>
               </PivotItem>

               <PivotItem headerText="Joysticks" headerButtonProps={{'data-order': 2}}>
                  <Checkbox label="Joystick interface connected" checked={state.joystick_connected} onChange={(e)=>this.handleChangeJoystickConnected(e)} />
                  <ChoiceGroup defaultSelectedKey="B" options={joystickOptions} onChange={_onChange} label="Pick one" required={true} />;
               </PivotItem>

               <PivotItem headerText="Tape" headerButtonProps={{'data-order': 3}}>
                  <Uploader value="Load .WAV" onUpload={(f)=>this.handleUploadVZ(f)} accept=".wav" />
                  <div>Record file WAV</div>
                  <div>Stop tape</div>
                  <div>cassette audio: on/off</div>
               </PivotItem>

               <PivotItem headerText="Disk" headerButtonProps={{'data-order': 4}}>
                  <div>Disk drive interface on/off</div>
                  <div>Load disk in drive 1</div>
                  <div>Load disk in drive 2</div>
                  <div>Download disk in drive 1</div>
                  <div>Download disk in drive 2</div>
                  <div>Unmount disk in drive 1</div>
                  <div>Unmount disk in drive 2</div>
               </PivotItem>

               <PivotItem headerText="Printer" headerButtonProps={{'data-order': 5}}>
                  <div>Save printer output</div>
               </PivotItem>

               <PivotItem headerText="Video" headerButtonProps={{'data-order': 6}}>
                  <div>Brighness contrast saturation</div>
                  <div>Monochrome output</div>
                  <div>Take snapshot</div>
               </PivotItem>

               <PivotItem headerText="Text files" headerButtonProps={{'data-order': 7}}>
                  <Uploader value="Load text file" onUpload={(e)=>this.handleUploadText(e)} accept=".txt,.bas" />
                  {/* paste clipboard */}
               </PivotItem>

               <PivotItem headerText="About" headerButtonProps={{'data-order': 8}}>
                  <Label>Laser 310 emulator, (C) 2021 Antonino Porcino</Label>
               </PivotItem>

            </Pivot>

            <Stack horizontal horizontalAlign="space-between">
               <DefaultButton onClick={()=>this.buttonResetClick()}>Reset CPU</DefaultButton>
               <PrimaryButton onClick={()=>this.buttonCloseClick()}>Close</PrimaryButton>
            </Stack>

         </div>
      </Modal>
      );
   }
}

export = EmulatorGUI;

