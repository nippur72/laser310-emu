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
   droppedFiles(files);
});

function droppedFiles(files) {
   for(let i=0, file; file=files[i]; i++) {
      const reader = new FileReader();
      reader.onload = e2 => droppedFile(file.name, new Uint8Array(e2.target.result));
      reader.readAsArrayBuffer(file);
   }
}

async function droppedFile(outName, bytes) {
   const ext = getFileExtension(outName);

   if(ext == ".vz") {
      await storage.writeFile(outName, bytes);
      await run(outName);
   }
   else if(ext == ".wav") {
      console.log("WAV file dropped");
      const { sampleRate, channelData } = decodeSync(bytes.buffer);
      let samples = channelData[0];

      // allocates the playback buffer on the WASM side
      sys_tape_init_load(samples.length, sampleRate);
      samples.forEach((e,i) => sys_tape_load_data(i,e));
      sys_tape_play();

      return;
   }
   else if(ext == ".txt") {
      console.log("TXT file dropped");
      // const text = bytes.buffer.toString();
      const text = String.fromCharCode.apply(null, new Uint8Array(bytes.buffer));
      paste(text);
      return;
   }
   else {
      // unknown extensions are saved as is
      await storage.writeFile(outName, bytes);
      console.log(`"${outName}" saved in local storage (${bytes.length} bytes)`);
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

async function parseQueryStringCommands() {
   options = getQueryStringObject(options);

   if(options.restore !== false) {
      // try to restore previous state, if any
      restoreState();
   }

   if(options.load !== undefined) {
      const name = options.load;
      setTimeout(async ()=>{
         if(name.startsWith("http")) {
            // external load
            let vz = await externalLoad(name);
            load_vz_bytes(vz, true);
         }
         else {
            // internal load
            await fetchProgram(name);
         }
      }, 4000);
   }
}

async function fetchProgram(name)
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

