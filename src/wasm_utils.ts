
export function get_wasm_float32_array(wasm_instance: any, ptr: number, size: number) {
   let start = ptr / wasm_instance.HEAPF32.BYTES_PER_ELEMENT;
   let buffer = wasm_instance.HEAPF32.subarray(start,start+size);
   return buffer;
}

export function get_wasm_uint8_array(wasm_instance: any, ptr: number, size: number) {
   let start = ptr / wasm_instance.HEAPU8.BYTES_PER_ELEMENT;
   let buffer = wasm_instance.HEAPU8.subarray(start,start+size);
   return buffer;
}

