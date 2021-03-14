import React = require("react");

import { PrimaryButton, DefaultButton, Dropdown, IDropdownOption, Pivot, PivotItem, Label, Stack, IStackTokens } from '@fluentui/react';
import { Modal } from "@fluentui/react";

interface IEmulator {
   reset(): void;
   droppedFiles(files: FileList): void;
   setMachineType(machineType: string): void;
   setMemory(memory: string): void;
}

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

const numericalSpacingStackTokens: IStackTokens = {
   childrenGap: 10,
   padding: 10,
};

class Some extends React.Component
{
   state = {
       showPreferences: false,
       machine: 'vz300pal',
       memory: "18K"
   };

   togglePreferences = () => {
      this.setState({showPreferences: !this.state.showPreferences});
   }

   close() {
      this.setState({showPreferences: false});
   }

   handleKeyDown = (e: any) => {
      if(e.code == "F10") {
         // F10 toggle preferences window         
         this.togglePreferences();
      }
      else if(e.code == "Escape") {
         // close preferences window if open
         if(this.state.showPreferences) this.close();
      }
      else {
         // console.log(e.code);
      }
   }

   componentDidMount() {
      //document.addEventListener('emu-f10', this.togglePreferences);      
      document.addEventListener('keydown', this.handleKeyDown);      
   }

   componentWillUnmount(){
      //document.removeEventListener('emu-f10', this.togglePreferences, false);      
      document.removeEventListener("keydown", this.handleKeyDown, false);
   }

   buttonResetClick() {
      emulator.reset();
   }

   buttonCloseClick() {
      this.close();
   }

   handleUpload = (files: FileList) => {
      emulator.droppedFiles(files);
      this.close();
   }

   handleChangeMachine = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined): void => {
      if(item===undefined) return;
      let machineType = String(item.key);
      this.setState({machine: machineType});
      emulator.setMachineType(machineType);
   }

   handleChangeMemory = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption|undefined): void => {
      if(item===undefined) return;
      let memory = String(item.key);
      this.setState({memory});
      emulator.setMemory(String(memory));
   }

   render() {
      return (
         <Modal isOpen={this.state.showPreferences}>
            <div onKeyDown={this.handleKeyDown} style={{padding: '2em'}}>
               <Pivot style={{height: '500px'}}>

                  <PivotItem headerText="Files" headerButtonProps={{'data-order': 1}}>
                     <Label>Programs</Label>
                     <Stack horizontal horizontalAlign="start" tokens={numericalSpacingStackTokens}>
                        <UploadButton value="Load VZ" onUpload={this.handleUpload} accept=".vz" />
                        <DefaultButton onClick={()=>{}} disabled={true}>Save VZ</DefaultButton>
                     </Stack>
                     {/*
                     <DefaultButton onClick={()=>{}} disabled={true}>Download BINARY memory area</DefaultButton>
                     <UploadButton value="Load cart" onUpload={this.handleUpload} accept=".bin" />
                     <div>Remove cart</div>
                     <div>Load ROM</div>
                     */}
                  </PivotItem>

                  <PivotItem headerText="Machine" headerButtonProps={{'data-order': 2}}>
                     <Dropdown label="Machine" options={machineOptions} selectedKey={this.state.machine} onChange={this.handleChangeMachine} />
                     <Dropdown label="Memory" options={memoryOptions} selectedKey={this.state.memory} onChange={this.handleChangeMemory} />
                     <div>MC6847 snow: on/off</div>
                     <div>joystick emulation: off/numpad/cursor keys</div>
                  </PivotItem>

                  <PivotItem headerText="Tape" headerButtonProps={{'data-order': 3}}>
                     <UploadButton value="Load .WAV" onUpload={this.handleUpload} accept=".wav" />
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
                     <div>Load text file</div>
                     <div>Paste clipboard text</div>
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

export = Some;

/*
<input type="file" id="input" onChange={()=>console.log("changed")}></input>
                <!--
                <div>This is a counter: {this.state.count}</div>
                <button onClick={()=>this.click()}>Click me</button>
                -->
accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*">
*/

interface IUploadButtonProps {
   value: string;
   onUpload(files: FileList): void;
   accept: string;
}

class UploadButton extends React.Component<IUploadButtonProps> {
   inputRef: React.RefObject<HTMLInputElement>;

   constructor(props: IUploadButtonProps) {
      super(props);
      this.inputRef = React.createRef();
   }

   handleButtonClick = ()=> {
      this.inputRef.current?.click();
   }

   handleInputChange = () => {
      let files = this.inputRef.current?.files;
      if(!files) return;
      this.props.onUpload(files);
   }

   render() {
      return (
         <span>
            <input
               type="file"
               ref={this.inputRef}
               style={{display: "none"}}
               onChange={this.handleInputChange}
               accept={this.props.accept}
            ></input>
            <DefaultButton onClick={this.handleButtonClick}>{this.props.value}</DefaultButton>
         </span>
      );
   }
}
