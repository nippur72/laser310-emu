"use strict";

// TODO find a good palette
// TODO load cart
// TODO selectable PAL NTSC
// TODO selectable VZ200 VZ300
// TODO selectrable RAM size
// TODO implement disk
// TODO numpad or cursor keys joystick
// TODO fix CRSR_STATE
// TODO fix tastiera XSnake / tastiera fisica
// TODO test programs: exact CPU speed
// TODO test programs: interrupt rate
// TODO test programs: snow effect when program resides in vram
// TODO continue UI
// --
// *TODO cassette save WAV / save audio
// *TODO align MC6847 to upstream
// *TODO renderer 1x1
// *TODO MC6847 palette
// *TODO test programs: snow effect in text and gr mode
// *TODO test programs: frame duration in CPU ticks
// *TODO switchable snow effect
// *TODO investigate speaker_A and speaker_B

/******************/

import { getLaser310 } from "./index";
import { updateGamePad } from "./joystick";
import { parseQueryStringCommands, droppedFiles } from "./browser";
import { vzrom20 } from "./roms/vzrom20";
import { vzrom21 } from "./roms/vzrom21";

// framerate * 310 * linerate * 228 = cpu
// 50.18125 * 310 * 15625

let cpuSpeed = 3546900;               // VZEM: 3546900 VZ300, 3579500 VZ200
let vdcSpeed = 3546900;               // same clock as CPU
let frameRate = 50.1812;              // ~50 Hz, 50.1812 measured on my Laser 310

let frames = 0;
let averageFrameTime = 0;
let averageLoad = 0;

let cycle = 0;

export interface QueryStringOptions {
   // load: undefined,
   // restore: false,
   rom: string|undefined,
   load: string|undefined
}

export let options: QueryStringOptions = {
   // load: undefined,
   // restore: false,
   rom: undefined,
   load: undefined
};

let last_timestamp = 0;
let frame_skips = 0;
export function oneFrame(timestamp: number|undefined) {
   const stamp = timestamp == undefined ? last_timestamp : timestamp;
   const msec = stamp - last_timestamp;
   let cycles = cpuSpeed * msec / 1000;
   last_timestamp = stamp;

   // put a limit on the maximum frame time
   let skip = false;
   if(msec > frameRate*2) {
      cycles = cpuSpeed * (frameRate*2 / 1000);
      skip = true;
      frame_skips++;
   }

   let { joy0, joy1 } = updateGamePad();
   getLaser310().sys_joystick(joy0, joy1);

   let starttime = performance.now();
   getLaser310().sys_ticks(cycles);
   let endtime = performance.now();
   let elapsed = endtime - starttime;
   let load = (elapsed / msec) * 100;

   if(!skip && msec != 0) {
      averageFrameTime = averageFrameTime * 0.992 + msec * 0.008;
      averageLoad = averageLoad * 0.992 + load * 0.008;
   }

   if(!getLaser310().stopped) requestAnimationFrame(oneFrame);
}

export function main() {

   parseQueryStringCommands();

   let laser310 = getLaser310();

   // loads the eprom
   {
      let firmware: Uint8Array;
      if(options.rom == undefined) options.rom = "v21";
      if(options.rom == "v20") { firmware = vzrom20; laser310.BASTXT=0x78A4; laser310.BASEND=0x78F9; laser310.CRSR_STATE=0x52C7; }
      if(options.rom == "v21") { firmware = vzrom21; laser310.BASTXT=0x78A4; laser310.BASEND=0x78F9; laser310.CRSR_STATE=0x52F7; }
      laser310.resetROM(firmware!);
   }

   laser310.cpu_reset();
   laser310.sys_init();
   laser310.sys_reset();
   laser310.audio.start();

   laser310.connectJoystick(true);

   // starts drawing frames
   laser310.stopped = false;
   oneFrame(undefined);
}

function __get_wasm_float32_array(ptr: number, size: number) {
   let start = ptr / getLaser310().wasm_instance.HEAPF32.BYTES_PER_ELEMENT;
   let buffer =  getLaser310().wasm_instance.HEAPF32.subarray(start,start+size);
   return buffer;
}

function get_wasm_uint8_array(ptr: number, size: number) {
   let start = ptr / getLaser310().wasm_instance.HEAPU8.BYTES_PER_ELEMENT;
   let buffer = getLaser310().wasm_instance.HEAPU8.subarray(start,start+size);
   return buffer;
}

// FORMULA: one buffer arrives every t cpu cycles
// T = (3686400 / 2) / (48000 / BUFFER_SIZE)
// in msec: t = BUFFER_SIZE / 48000 = 85.3

export function ay38910_audio_buf_ready(ptr: number, size:number) {
   if(!getLaser310().audio.playing) return;
   let buffer = __get_wasm_float32_array(ptr, size);
   getLaser310().audio.playBuffer(buffer);
}

import { encode } from "wav-encoder";

import { downloadBytes } from "./download";

// called from WASM after tape has finished recording
function csave_cb(ptr: number, size: number, samplerate: number) {

   let audio = __get_wasm_float32_array(ptr, size);
   const length = Math.round(audio.length / samplerate);

   const wavData = {
      sampleRate: samplerate,
      channelData: [ audio ]
   };

   const buffer = encode.sync(wavData, { bitDepth: 16, float: false, symmetric: false });
   let fileName = "csaved.wav"
   downloadBytes(fileName, buffer);
}

// cassette save
function csave() {
   getLaser310().sys_tape_record();
}

// cassette stop
function cstop() {
   getLaser310().sys_tape_stop();
}
