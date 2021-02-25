// handles interaction between browser and emulation

let aspect = 1.25;

function onResize(e) {
   const canvas = document.getElementById("canvas");

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
        if(canvas.webkitRequestFullscreen !== undefined) canvas.webkitRequestFullscreen();
   else if(canvas.mozRequestFullScreen !== undefined) canvas.mozRequestFullScreen();
   onResize();
}

window.addEventListener("resize", onResize);
window.addEventListener("dblclick", goFullScreen);

onResize();

// **** save state on close ****

window.onbeforeunload = function(e) {
   saveState();
 };

// **** visibility change ****

window.addEventListener("visibilitychange", function() {
   if(document.visibilityState === "hidden")
   {
      stopped = true;
      audio.stop();
   }
   else if(document.visibilityState === "visible")
   {
      stopped = false;
      oneFrame();
      audio.start();
   }
});

// **** drag & drop ****

const dropZone = document.getElementById('screen');

// Optional.   Show the copy icon when dragging over.  Seems to only work for chrome.
dropZone.addEventListener('dragover', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer.dropEffect = 'copy';
});

// Get file data on drop
dropZone.addEventListener('drop', e => {
   audio.resume();

   e.stopPropagation();
   e.preventDefault();
   const files = e.dataTransfer.files; // Array of all files

   for(let i=0, file; file=files[i]; i++) {
      const reader = new FileReader();
      reader.onload = e2 => droppedFile(file.name, new Uint8Array(e2.target.result));
      reader.readAsArrayBuffer(file);
   }
});

async function droppedFile(outName, bytes) {
   const ext = getFileExtension(outName);

   if(ext == ".bin") {
      await storage.writeFile(outName, bytes);
      await crun(outName);
   }
   else if(ext == ".vz") {
      await storage.writeFile(outName, bytes);
      await crun(outName);
   }
   else if(ext == ".wav") {
      console.log("WAV file dropped");
      const { sampleRate, channelData } = decodeSync(bytes.buffer);
      let byte_samples = channelData[0].map(e=>e>0?1:0); // turn samples 0,1

      // allocates the playback buffer on the WASM side
      sys_tape_init_load(byte_samples.length, sampleRate);
      byte_samples.forEach((e,i) => sys_tape_load_data(i,e));
      sys_tape_playback();

      return;
   }
}

function getQueryStringObject(options) {
   let a = window.location.search.split("&");
   let o = a.reduce((o, v) =>{
      var kv = v.split("=");
      const key = kv[0].replace("?", "");
      let value = kv[1];
           if(value === "true") value = true;
      else if(value === "false") value = false;
      o[key] = value;
      return o;
   }, options);
   return o;
}

function parseQueryStringCommands() {
   options = getQueryStringObject(options);

   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }

   if(options.load !== undefined) {
      const name = options.load;
      fetchProgramAll(name);
   }

   if(options.bt !== undefined ||
      options.bb !== undefined ||
      options.bh !== undefined ||
      options.aspect !== undefined
   ) {
      if(options.bt     !== undefined) border_top    = Number(options.bt);
      if(options.bb     !== undefined) border_bottom = Number(options.bb);
      if(options.bh     !== undefined) border_h      = Number(options.bh);
      if(options.aspect !== undefined) aspect        = Number(options.aspect);
      calculateGeometry();
      onResize();
   }
}

async function fetchProgramAll(name) {
   const candidates = [
      name,
      `${name}.prg`,
      `${name}/${name}`,
      `${name}/${name}.prg`,
      `prg/${name}`,
      `prg/${name}.bin`,
      `prg/${name}/${name}`,
      `prg/${name}/${name}.prg`
   ];

   for(let t=0;t<candidates.length;t++) {
      if(await fetchProgram(candidates[t])) return;
   }

   console.log(`cannot load "${name}"`);
}

async function fetchProgram(name)
{
   console.log(`wanting to load ${name}`);
   try
   {
      const response = await fetch(`software/${name}`);
      if(response.status === 404) return false;
      const bytes = new Uint8Array(await response.arrayBuffer());
      setTimeout(()=>droppedFile(name, bytes), 3000);
      return true;
   }
   catch(err)
   {
      return false;
   }
}
