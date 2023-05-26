
var emscripten_module = (() => {
  var _scriptDir = import.meta.url;
  
  return (
function(emscripten_module = {})  {

var Module=typeof emscripten_module!="undefined"?emscripten_module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;if(Module["locateFile"]){wasmBinaryFile="emscripten_module.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}}else{wasmBinaryFile=new URL("emscripten_module.wasm",import.meta.url).href}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["c"];updateMemoryViews();wasmTable=Module["asm"]["Ia"];addOnInit(Module["asm"]["d"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch=="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}instantiateAsync().catch(readyPromiseReject);return{}}var ASM_CONSTS={2052:$0=>{console.log("io read from unknown port",$0)},2101:()=>{if(debugBefore!==undefined)debugBefore()},2149:()=>{if(debugAfter!==undefined)debugAfter()},2196:($0,$1)=>{return ay38910_audio_buf_ready($0,$1)},2240:$0=>{vdp_screen_update_mc($0)},2270:$0=>{laser310.printer.print($0)},2302:()=>{return laser310.printer.ready},2337:()=>{return led_read()},2360:$0=>{led_write($0)},2379:($0,$1,$2)=>{csave_cb($0,$1,$2)}};function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}var readEmAsmArgsArray=[];function readEmAsmArgs(sigPtr,buf){readEmAsmArgsArray.length=0;var ch;buf>>=2;while(ch=HEAPU8[sigPtr++]){buf+=ch!=105&buf;readEmAsmArgsArray.push(ch==105?HEAP32[buf]:HEAPF64[buf++>>1]);++buf}return readEmAsmArgsArray}function runEmAsmFunction(code,sigPtr,argbuf){var args=readEmAsmArgs(sigPtr,argbuf);return ASM_CONSTS[code].apply(null,args)}function _emscripten_asm_const_int(code,sigPtr,argbuf){return runEmAsmFunction(code,sigPtr,argbuf)}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(size){var b=wasmMemory.buffer;try{wasmMemory.grow(size-b.byteLength+65535>>>16);updateMemoryViews();return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}function getCFunc(ident){var func=Module["_"+ident];return func}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function cwrap(ident,returnType,argTypes,opts){var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var wasmImports={"a":_emscripten_asm_const_int,"b":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=function(){return(___wasm_call_ctors=Module["asm"]["d"]).apply(null,arguments)};var _sys_set_debug=Module["_sys_set_debug"]=function(){return(_sys_set_debug=Module["_sys_set_debug"]=Module["asm"]["e"]).apply(null,arguments)};var _sys_ticks=Module["_sys_ticks"]=function(){return(_sys_ticks=Module["_sys_ticks"]=Module["asm"]["f"]).apply(null,arguments)};var _sys_init=Module["_sys_init"]=function(){return(_sys_init=Module["_sys_init"]=Module["asm"]["g"]).apply(null,arguments)};var _sys_reset=Module["_sys_reset"]=function(){return(_sys_reset=Module["_sys_reset"]=Module["asm"]["h"]).apply(null,arguments)};var _rom_load=Module["_rom_load"]=function(){return(_rom_load=Module["_rom_load"]=Module["asm"]["i"]).apply(null,arguments)};var _cpu_reset=Module["_cpu_reset"]=function(){return(_cpu_reset=Module["_cpu_reset"]=Module["asm"]["j"]).apply(null,arguments)};var _get_z80_a=Module["_get_z80_a"]=function(){return(_get_z80_a=Module["_get_z80_a"]=Module["asm"]["k"]).apply(null,arguments)};var _get_z80_f=Module["_get_z80_f"]=function(){return(_get_z80_f=Module["_get_z80_f"]=Module["asm"]["l"]).apply(null,arguments)};var _get_z80_l=Module["_get_z80_l"]=function(){return(_get_z80_l=Module["_get_z80_l"]=Module["asm"]["m"]).apply(null,arguments)};var _get_z80_h=Module["_get_z80_h"]=function(){return(_get_z80_h=Module["_get_z80_h"]=Module["asm"]["n"]).apply(null,arguments)};var _get_z80_e=Module["_get_z80_e"]=function(){return(_get_z80_e=Module["_get_z80_e"]=Module["asm"]["o"]).apply(null,arguments)};var _get_z80_d=Module["_get_z80_d"]=function(){return(_get_z80_d=Module["_get_z80_d"]=Module["asm"]["p"]).apply(null,arguments)};var _get_z80_c=Module["_get_z80_c"]=function(){return(_get_z80_c=Module["_get_z80_c"]=Module["asm"]["q"]).apply(null,arguments)};var _get_z80_b=Module["_get_z80_b"]=function(){return(_get_z80_b=Module["_get_z80_b"]=Module["asm"]["r"]).apply(null,arguments)};var _get_z80_fa=Module["_get_z80_fa"]=function(){return(_get_z80_fa=Module["_get_z80_fa"]=Module["asm"]["s"]).apply(null,arguments)};var _get_z80_af=Module["_get_z80_af"]=function(){return(_get_z80_af=Module["_get_z80_af"]=Module["asm"]["t"]).apply(null,arguments)};var _get_z80_hl=Module["_get_z80_hl"]=function(){return(_get_z80_hl=Module["_get_z80_hl"]=Module["asm"]["u"]).apply(null,arguments)};var _get_z80_de=Module["_get_z80_de"]=function(){return(_get_z80_de=Module["_get_z80_de"]=Module["asm"]["v"]).apply(null,arguments)};var _get_z80_bc=Module["_get_z80_bc"]=function(){return(_get_z80_bc=Module["_get_z80_bc"]=Module["asm"]["w"]).apply(null,arguments)};var _get_z80_fa_=Module["_get_z80_fa_"]=function(){return(_get_z80_fa_=Module["_get_z80_fa_"]=Module["asm"]["x"]).apply(null,arguments)};var _get_z80_af_=Module["_get_z80_af_"]=function(){return(_get_z80_af_=Module["_get_z80_af_"]=Module["asm"]["y"]).apply(null,arguments)};var _get_z80_hl_=Module["_get_z80_hl_"]=function(){return(_get_z80_hl_=Module["_get_z80_hl_"]=Module["asm"]["z"]).apply(null,arguments)};var _get_z80_de_=Module["_get_z80_de_"]=function(){return(_get_z80_de_=Module["_get_z80_de_"]=Module["asm"]["A"]).apply(null,arguments)};var _get_z80_bc_=Module["_get_z80_bc_"]=function(){return(_get_z80_bc_=Module["_get_z80_bc_"]=Module["asm"]["B"]).apply(null,arguments)};var _get_z80_sp=Module["_get_z80_sp"]=function(){return(_get_z80_sp=Module["_get_z80_sp"]=Module["asm"]["C"]).apply(null,arguments)};var _get_z80_iy=Module["_get_z80_iy"]=function(){return(_get_z80_iy=Module["_get_z80_iy"]=Module["asm"]["D"]).apply(null,arguments)};var _get_z80_ix=Module["_get_z80_ix"]=function(){return(_get_z80_ix=Module["_get_z80_ix"]=Module["asm"]["E"]).apply(null,arguments)};var _get_z80_wz=Module["_get_z80_wz"]=function(){return(_get_z80_wz=Module["_get_z80_wz"]=Module["asm"]["F"]).apply(null,arguments)};var _get_z80_pc=Module["_get_z80_pc"]=function(){return(_get_z80_pc=Module["_get_z80_pc"]=Module["asm"]["G"]).apply(null,arguments)};var _get_z80_ir=Module["_get_z80_ir"]=function(){return(_get_z80_ir=Module["_get_z80_ir"]=Module["asm"]["H"]).apply(null,arguments)};var _get_z80_i=Module["_get_z80_i"]=function(){return(_get_z80_i=Module["_get_z80_i"]=Module["asm"]["I"]).apply(null,arguments)};var _get_z80_r=Module["_get_z80_r"]=function(){return(_get_z80_r=Module["_get_z80_r"]=Module["asm"]["J"]).apply(null,arguments)};var _get_z80_im=Module["_get_z80_im"]=function(){return(_get_z80_im=Module["_get_z80_im"]=Module["asm"]["K"]).apply(null,arguments)};var _get_z80_iff1=Module["_get_z80_iff1"]=function(){return(_get_z80_iff1=Module["_get_z80_iff1"]=Module["asm"]["L"]).apply(null,arguments)};var _get_z80_iff2=Module["_get_z80_iff2"]=function(){return(_get_z80_iff2=Module["_get_z80_iff2"]=Module["asm"]["M"]).apply(null,arguments)};var _get_z80_ei_pending=Module["_get_z80_ei_pending"]=function(){return(_get_z80_ei_pending=Module["_get_z80_ei_pending"]=Module["asm"]["N"]).apply(null,arguments)};var _set_z80_a=Module["_set_z80_a"]=function(){return(_set_z80_a=Module["_set_z80_a"]=Module["asm"]["O"]).apply(null,arguments)};var _set_z80_f=Module["_set_z80_f"]=function(){return(_set_z80_f=Module["_set_z80_f"]=Module["asm"]["P"]).apply(null,arguments)};var _set_z80_l=Module["_set_z80_l"]=function(){return(_set_z80_l=Module["_set_z80_l"]=Module["asm"]["Q"]).apply(null,arguments)};var _set_z80_h=Module["_set_z80_h"]=function(){return(_set_z80_h=Module["_set_z80_h"]=Module["asm"]["R"]).apply(null,arguments)};var _set_z80_e=Module["_set_z80_e"]=function(){return(_set_z80_e=Module["_set_z80_e"]=Module["asm"]["S"]).apply(null,arguments)};var _set_z80_d=Module["_set_z80_d"]=function(){return(_set_z80_d=Module["_set_z80_d"]=Module["asm"]["T"]).apply(null,arguments)};var _set_z80_c=Module["_set_z80_c"]=function(){return(_set_z80_c=Module["_set_z80_c"]=Module["asm"]["U"]).apply(null,arguments)};var _set_z80_b=Module["_set_z80_b"]=function(){return(_set_z80_b=Module["_set_z80_b"]=Module["asm"]["V"]).apply(null,arguments)};var _set_z80_af=Module["_set_z80_af"]=function(){return(_set_z80_af=Module["_set_z80_af"]=Module["asm"]["W"]).apply(null,arguments)};var _set_z80_fa=Module["_set_z80_fa"]=function(){return(_set_z80_fa=Module["_set_z80_fa"]=Module["asm"]["X"]).apply(null,arguments)};var _set_z80_hl=Module["_set_z80_hl"]=function(){return(_set_z80_hl=Module["_set_z80_hl"]=Module["asm"]["Y"]).apply(null,arguments)};var _set_z80_de=Module["_set_z80_de"]=function(){return(_set_z80_de=Module["_set_z80_de"]=Module["asm"]["Z"]).apply(null,arguments)};var _set_z80_bc=Module["_set_z80_bc"]=function(){return(_set_z80_bc=Module["_set_z80_bc"]=Module["asm"]["_"]).apply(null,arguments)};var _set_z80_fa_=Module["_set_z80_fa_"]=function(){return(_set_z80_fa_=Module["_set_z80_fa_"]=Module["asm"]["$"]).apply(null,arguments)};var _set_z80_af_=Module["_set_z80_af_"]=function(){return(_set_z80_af_=Module["_set_z80_af_"]=Module["asm"]["aa"]).apply(null,arguments)};var _set_z80_hl_=Module["_set_z80_hl_"]=function(){return(_set_z80_hl_=Module["_set_z80_hl_"]=Module["asm"]["ba"]).apply(null,arguments)};var _set_z80_de_=Module["_set_z80_de_"]=function(){return(_set_z80_de_=Module["_set_z80_de_"]=Module["asm"]["ca"]).apply(null,arguments)};var _set_z80_bc_=Module["_set_z80_bc_"]=function(){return(_set_z80_bc_=Module["_set_z80_bc_"]=Module["asm"]["da"]).apply(null,arguments)};var _set_z80_sp=Module["_set_z80_sp"]=function(){return(_set_z80_sp=Module["_set_z80_sp"]=Module["asm"]["ea"]).apply(null,arguments)};var _set_z80_iy=Module["_set_z80_iy"]=function(){return(_set_z80_iy=Module["_set_z80_iy"]=Module["asm"]["fa"]).apply(null,arguments)};var _set_z80_ix=Module["_set_z80_ix"]=function(){return(_set_z80_ix=Module["_set_z80_ix"]=Module["asm"]["ga"]).apply(null,arguments)};var _set_z80_wz=Module["_set_z80_wz"]=function(){return(_set_z80_wz=Module["_set_z80_wz"]=Module["asm"]["ha"]).apply(null,arguments)};var _set_z80_pc=Module["_set_z80_pc"]=function(){return(_set_z80_pc=Module["_set_z80_pc"]=Module["asm"]["ia"]).apply(null,arguments)};var _set_z80_ir=Module["_set_z80_ir"]=function(){return(_set_z80_ir=Module["_set_z80_ir"]=Module["asm"]["ja"]).apply(null,arguments)};var _set_z80_i=Module["_set_z80_i"]=function(){return(_set_z80_i=Module["_set_z80_i"]=Module["asm"]["ka"]).apply(null,arguments)};var _set_z80_r=Module["_set_z80_r"]=function(){return(_set_z80_r=Module["_set_z80_r"]=Module["asm"]["la"]).apply(null,arguments)};var _set_z80_im=Module["_set_z80_im"]=function(){return(_set_z80_im=Module["_set_z80_im"]=Module["asm"]["ma"]).apply(null,arguments)};var _set_z80_iff1=Module["_set_z80_iff1"]=function(){return(_set_z80_iff1=Module["_set_z80_iff1"]=Module["asm"]["na"]).apply(null,arguments)};var _set_z80_iff2=Module["_set_z80_iff2"]=function(){return(_set_z80_iff2=Module["_set_z80_iff2"]=Module["asm"]["oa"]).apply(null,arguments)};var _set_z80_ei_pending=Module["_set_z80_ei_pending"]=function(){return(_set_z80_ei_pending=Module["_set_z80_ei_pending"]=Module["asm"]["pa"]).apply(null,arguments)};var _mem_read=Module["_mem_read"]=function(){return(_mem_read=Module["_mem_read"]=Module["asm"]["qa"]).apply(null,arguments)};var _mem_write=Module["_mem_write"]=function(){return(_mem_write=Module["_mem_write"]=Module["asm"]["ra"]).apply(null,arguments)};var _io_read=Module["_io_read"]=function(){return(_io_read=Module["_io_read"]=Module["asm"]["sa"]).apply(null,arguments)};var _io_write=Module["_io_write"]=function(){return(_io_write=Module["_io_write"]=Module["asm"]["ta"]).apply(null,arguments)};var _sys_keyboard_reset=Module["_sys_keyboard_reset"]=function(){return(_sys_keyboard_reset=Module["_sys_keyboard_reset"]=Module["asm"]["ua"]).apply(null,arguments)};var _sys_keyboard_press=Module["_sys_keyboard_press"]=function(){return(_sys_keyboard_press=Module["_sys_keyboard_press"]=Module["asm"]["va"]).apply(null,arguments)};var _sys_keyboard_release=Module["_sys_keyboard_release"]=function(){return(_sys_keyboard_release=Module["_sys_keyboard_release"]=Module["asm"]["wa"]).apply(null,arguments)};var _sys_tape_init_load=Module["_sys_tape_init_load"]=function(){return(_sys_tape_init_load=Module["_sys_tape_init_load"]=Module["asm"]["xa"]).apply(null,arguments)};var _sys_tape_load_data=Module["_sys_tape_load_data"]=function(){return(_sys_tape_load_data=Module["_sys_tape_load_data"]=Module["asm"]["ya"]).apply(null,arguments)};var _sys_tape_play=Module["_sys_tape_play"]=function(){return(_sys_tape_play=Module["_sys_tape_play"]=Module["asm"]["za"]).apply(null,arguments)};var _sys_tape_record=Module["_sys_tape_record"]=function(){return(_sys_tape_record=Module["_sys_tape_record"]=Module["asm"]["Aa"]).apply(null,arguments)};var _sys_tape_stop=Module["_sys_tape_stop"]=function(){return(_sys_tape_stop=Module["_sys_tape_stop"]=Module["asm"]["Ba"]).apply(null,arguments)};var _sys_joystick=Module["_sys_joystick"]=function(){return(_sys_joystick=Module["_sys_joystick"]=Module["asm"]["Ca"]).apply(null,arguments)};var _sys_total_cycles=Module["_sys_total_cycles"]=function(){return(_sys_total_cycles=Module["_sys_total_cycles"]=Module["asm"]["Da"]).apply(null,arguments)};var _sys_snow_effect=Module["_sys_snow_effect"]=function(){return(_sys_snow_effect=Module["_sys_snow_effect"]=Module["asm"]["Ea"]).apply(null,arguments)};var _sys_set_machine_type=Module["_sys_set_machine_type"]=function(){return(_sys_set_machine_type=Module["_sys_set_machine_type"]=Module["asm"]["Fa"]).apply(null,arguments)};var _sys_set_joystick_connected=Module["_sys_set_joystick_connected"]=function(){return(_sys_set_joystick_connected=Module["_sys_set_joystick_connected"]=Module["asm"]["Ga"]).apply(null,arguments)};var _sys_get_joystick_connected=Module["_sys_get_joystick_connected"]=function(){return(_sys_get_joystick_connected=Module["_sys_get_joystick_connected"]=Module["asm"]["Ha"]).apply(null,arguments)};var ___errno_location=function(){return(___errno_location=Module["asm"]["__errno_location"]).apply(null,arguments)};var stackSave=function(){return(stackSave=Module["asm"]["Ja"]).apply(null,arguments)};var stackRestore=function(){return(stackRestore=Module["asm"]["Ka"]).apply(null,arguments)};var stackAlloc=function(){return(stackAlloc=Module["asm"]["La"]).apply(null,arguments)};Module["ccall"]=ccall;Module["cwrap"]=cwrap;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return emscripten_module.ready
}
);
})();
export default emscripten_module;