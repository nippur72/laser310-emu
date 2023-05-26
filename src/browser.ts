// handles interaction between browser and emulation

import { oneFrame } from "./emulator";
import { getLaser310 } from "./index";
import { getFileExtension } from "./bytes";
import { QueryStringOptions } from "./emulator";
import { externalLoad } from "./mdawson";

let aspect = 1.25;

function onResize() {
   const canvas = document.getElementById("canvas") as HTMLCanvasElement;

   if(window.innerWidth > (window.innerHeight*aspect))
   {
      canvas.style.width  = `${aspect*100}vmin`;
      canvas.style.height = "100vmin";
   }
   else if(window.innerWidth > window.innerHeight)
   {
      canvas.style.width  = "100vmax";
      canvas.style.height = `${(1/aspect)*100}vmax`;
   }
   else
   {
      canvas.style.width  = "100vmin";
      canvas.style.height = `${(1/aspect)*100}vmin`;
   }
}

function goFullScreen()
{
   const canvas = document.getElementById("canvas") as HTMLCanvasElement;
   if(canvas.requestFullscreen !== undefined) canvas.requestFullscreen();
   onResize();
}

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);

onResize();

// **** save state on close ****

window.onbeforeunload = function(e) {
   // saveState();
};

// **** visibility change ****

window.addEventListener("visibilitychange", function() {
   if(document.visibilityState === "hidden")
   {
      getLaser310().stopped = true;
      getLaser310().audio.stop();
   }
   else if(document.visibilityState === "visible")
   {
      getLaser310().stopped = false;
      oneFrame(undefined);
      getLaser310().audio.start();
   }
});

// **** drag & drop ****

const dropZone = document.getElementById('screen') as HTMLDivElement;

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer!.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', e => {
   getLaser310().audio.resume();

   e.stopPropagation();
   e.preventDefault();
   const files = e.dataTransfer!.files; // Array of all files
   droppedFiles(files);
});

function readFile(file: File): Promise<Uint8Array> {
   return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = e => {
         if(e.target!== null && e.target.result !== null && e.target.result instanceof ArrayBuffer) {
            resolve(new Uint8Array(e.target.result));            
         }
      }
      reader.readAsArrayBuffer(file);   
   });
}

export async function readFiles(files: FileList): Promise<Uint8Array[]> {
   let result: Uint8Array[] = [];
   for(let i=0; i<files.length; i++) {
      result.push(await readFile(files[i]));
   }
   return result;
}

export function droppedFiles(files: FileList) {
   for(let i=0; i<files.length; i++) {
      let file = files[i];
      const reader = new FileReader();
      reader.onload = e2 => {
         if(e2.target!== null && e2.target.result !== null && e2.target.result instanceof ArrayBuffer) {
            droppedFile(file.name, new Uint8Array(e2.target.result));
         }
      }
      reader.readAsArrayBuffer(file);
   }
}

import { decode } from "wav-decoder";

async function droppedFile(outName: string, bytes: Uint8Array) {

   const ext = getFileExtension(outName);

   if(ext == ".vz") {
      throw "not implemented";
      //await storage.writeFile(outName, bytes);
      //await run(outName);
   }
   else if(ext == ".wav") {
      console.log("WAV file dropped");
      const { sampleRate, channelData } = decode.sync(bytes.buffer);
      let samples = channelData[0];

      // allocates the playback buffer on the WASM side
      getLaser310().sys_tape_init_load(samples.length, sampleRate);
      samples.forEach((e:number,i:number) => getLaser310().sys_tape_load_data(i,e));
      getLaser310().sys_tape_play();

      return;
   }
   else if(ext == ".txt") {
      console.log("TXT file dropped");
      // const text = bytes.buffer.toString();
      const text = String.fromCharCode.apply(null, Array.from(bytes));
      getLaser310().paste(text);
      return;
   }
   else {
      throw "not implemented";
      // unknown extensions are saved as is
      //await storage.writeFile(outName, bytes);
      //console.log(`"${outName}" saved in local storage (${bytes.length} bytes)`);
   }
}

function getQueryStringObject(options: QueryStringOptions) {
   let a = window.location.search.split("&");
   let o = a.reduce((o: any, v) =>{
      var kv = v.split("=");
      const key = kv[0].replace("?", "");
      let value: string|boolean = kv[1];
           if(value === "true") value = true;
      else if(value === "false") value = false;
      o[key] = value;
      return o;
   }, options);
   return o;
}

import { options as defaultOptions } from "./emulator";

export async function parseQueryStringCommands() {
   let options = getQueryStringObject(defaultOptions) as QueryStringOptions;

   /*
   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }
   */

   if(options.load !== undefined) {
      const name = options.load;
      setTimeout(async ()=>{
         if(name.startsWith("http")) {
            // external load
            let vz = await externalLoad(name);
            getLaser310().load_vz_bytes(vz, true);
         }
         else {
            // internal load
            await fetchProgram(name);
         }
      }, 4000);
   }
}

async function fetchProgram(name: string)
{
   //console.log(`wanting to load ${name}`);
   try
   {
      const response = await fetch(`software/${name}`);
      if(response.status === 404) return false;
      const bytes = new Uint8Array(await response.arrayBuffer());
      droppedFile(name, bytes);
      return true;
   }
   catch(err)
   {
      return false;
   }
}

export async function download(fileName: string) {
   throw "not implemented";
   /*
   if(!await this.fileExists(fileName)) {
      console.log(`file "${fileName}" not found`);
      return;
   }
   const bytes = await this.readFile(fileName);
   let blob = new Blob([bytes], {type: "application/octet-stream"});
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
   */
}

// keyboard.js
import { keyDown, keyUp } from "./keyboard";
document.onkeydown = keyDown;
document.onkeyup = keyUp;
