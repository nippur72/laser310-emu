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

// FORMULA: one buffer arrives every t cpu cycles
// T = (3686400 / 2) / (48000 / BUFFER_SIZE)
// in msec: t = BUFFER_SIZE / 48000 = 85.3

export function ay38910_audio_buf_ready(ptr: number, size:number) {
   let laser310 = getLaser310();
   if(!laser310.audio.playing) return;
   let buffer = get_wasm_float32_array(laser310.wasm_instance, ptr, size);
   laser310.audio.playBuffer(buffer);
}

import { encode } from "wav-encoder";

import { downloadBytes } from "./download";
import { get_wasm_float32_array } from "./wasm_utils";

// called from WASM after tape has finished recording
export function csave_cb(ptr: number, size: number, samplerate: number) {

   let audio = get_wasm_float32_array(getLaser310().wasm_instance, ptr, size);
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
