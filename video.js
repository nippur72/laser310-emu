let RENDER_MULTIPLIER = 2;

function calculateGeometry_mc() {
   /*
   const BORDER_V_TOP    = 16;
   const BORDER_V_BOTTOM = 16;
   const BORDER_H_LEFT   =  8;
   const BORDER_H_RIGHT  =  8;
   const TEXT_W = 256;
   const TEXT_H = 192;
   */

   // full screen
   const BORDER_V_TOP    = 25;
   const BORDER_V_BOTTOM = 25;
   const BORDER_H_LEFT   =  32;
   const BORDER_H_RIGHT  =  32;
   const TEXT_W = 256;
   const TEXT_H = 192;

   let SCREEN_W = BORDER_H_LEFT + TEXT_W + BORDER_H_RIGHT;
   let SCREEN_H = BORDER_V_TOP  + TEXT_H + BORDER_V_BOTTOM;

   // canvas is the outer canvas where the aspect ratio is corrected
   let canvas = document.getElementById("canvas");
   canvas.width  = SCREEN_W * RENDER_MULTIPLIER;
   canvas.height = SCREEN_H * RENDER_MULTIPLIER;
}

calculateGeometry_mc();

const MC_DOT_WIDTH = 320;
const MC_DOT_HEIGHT = 243;

//const MC_OFFSET_X = -48;
//const MC_OFFSET_Y = -18;

const MC_OFFSET_X = 0;
const MC_OFFSET_Y = 0;

let mc6847_canvas = document.getElementById("canvas");
let mc6847_context = mc6847_canvas.getContext('2d');
let mc6847_imagedata = mc6847_context.createImageData(MC_DOT_WIDTH*RENDER_MULTIPLIER, MC_DOT_HEIGHT*RENDER_MULTIPLIER);
let mc6847_imagedata_data = new Uint32Array(mc6847_imagedata.data.buffer);

/*
let mc6847_imagedata = mc6847_context.getImageData(0, 0, MC_DOT_WIDTH*RENDER_MULTIPLIER, MC_DOT_HEIGHT*RENDER_MULTIPLIER);
let mc6847_imagedata_buffer = new ArrayBuffer(mc6847_imagedata.data.length);
let mc6847_imagedata_buf8 = new Uint8ClampedArray(mc6847_imagedata_buffer);
let mc6847_imagedata_data = new Uint32Array(mc6847_imagedata_buffer);
*/

// not interlaced
function vdp_screen_update_mc(ptr) {
   let start = ptr / wasm_instance.HEAPU32.BYTES_PER_ELEMENT;
   let size = MC_DOT_WIDTH*MC_DOT_HEIGHT;
   let buffer = wasm_instance.HEAPU32.subarray(start,start+size);

   if(RENDER_MULTIPLIER === 2) {
      let ptr0 = 0;
      let ptr1 = 0;
      let ptr2 = MC_DOT_WIDTH*2;

      for(let y=0;y<MC_DOT_HEIGHT;y++) {
         for(let x=0;x<MC_DOT_WIDTH;x++) {
            let pixel = buffer[ptr0];
            mc6847_imagedata_data[ptr1++] = pixel;
            mc6847_imagedata_data[ptr1++] = pixel;
            mc6847_imagedata_data[ptr2++] = pixel;
            mc6847_imagedata_data[ptr2++] = pixel;
            ptr0++;
         }
         ptr1 += MC_DOT_WIDTH*2;
         ptr2 += MC_DOT_WIDTH*2;
      }
   }
   else {
      let ptr0 = 0;
      let ptr1 = 0;
      let ptr2 = MC_DOT_WIDTH;

      for(let y=0;y<MC_DOT_HEIGHT;y++) {
         for(let x=0;x<MC_DOT_WIDTH;x++) {
            let pixel = buffer[ptr0];
            mc6847_imagedata_data[ptr1++] = pixel;
            ptr0++;
         }         
      }
   }

   /*
   mc6847_imagedata.data.set(mc6847_imagedata_buf8);
   mc6847_context.putImageData(mc6847_imagedata, MC_OFFSET_X, MC_OFFSET_Y);
   */
   mc6847_context.putImageData(mc6847_imagedata, MC_OFFSET_X, MC_OFFSET_Y);

   frames++;
   if(end_of_frame_hook !== undefined) end_of_frame_hook();

   if(frames % 60 == 0) {
      // update LED
      document.getElementById("LED").style.visibility = LED>0 ? "visible" : "hidden";

      if(show_info) {
         let el = document.getElementById("framerate");
         el.style.visibility = "visible";
         el.innerHTML = `frame rate: ${Math.round(averageFrameTime)} ms (${Math.round(1000/averageFrameTime)}Hz) CPU load: ${Math.round(averageLoad)}%, drops: ${frame_skips}`;
      }
   }
}
