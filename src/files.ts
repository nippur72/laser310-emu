import { Laser310 } from "./emscripten_wrapper";

declare var laser310: Laser310;

// console commands disabled for now

/*
// console command
async function run(filename) {
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }
    const ext = getFileExtension(filename);
    if(ext === ".vz" ) await load_vz(filename, true);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function load(filename) {
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }
    const ext = getFileExtension(filename);
    if(ext === ".vz" ) await load_vz(filename, false);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function save(filename) {
    const ext = getFileExtension(filename);
    if(ext == ".vz" ) await save_vz(filename, undefined, undefined);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function bsave(filename, start, end) {
    const ext = getFileExtension(filename);
    if(ext == ".vz" ) await save_vz(filename, start, end);
    else console.log(`extension '${ext}' not supported`);
}
*/

// =====================================================================================


export async function load_vz(filename: string, runAfterLoad: boolean) {
    throw "not implemented";
    //const vz_bytes = await storage.readFile(filename);
    //load_vz_bytes(vz_bytes, runAfterLoad);
}

import { packvz, unpackvz, VZ_BASIC, VZ_BINARY } from "./vz";
import { hex } from "./bytes";
import { downloadBytes } from "./download";

/*
export function load_vz_bytes(vz_bytes: Uint8Array, runAfterLoad: boolean) {
    const VZ = unpackvz(vz_bytes);

    const isROM = VZ.start === 0 || VZ.start === 16384;

    // write data into memory (also writes in ROM for cartdriges and ROMs)
    for(let i=0; i<VZ.data.length; i++) {
        let addr = i+VZ.start;
        let data = VZ.data[i];
        if(isROM) laser310.rom_load(addr, data);
        else      laser310.mem_write(addr, data);
    }

    if(VZ.type == VZ_BASIC) {
        console.log(`loaded '${VZ.filename}' as BASIC program of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
    }
    else if(VZ.type == VZ_BINARY) {
        console.log(`loaded '${VZ.filename}' as binary data of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
    }

    // binary program
    if(VZ.type == VZ_BINARY) {
        if(runAfterLoad) {
            if(!isROM) {
                // normal binary file
                laser310.USR(VZ.start); // set USR(0) address;
                laser310.paste("X=USR(X)\n");
            }
            else {
                // ROM or cartdrige
                laser310.cpu_reset();
            }
        }
    }

    // basic program
    if(VZ.type == VZ_BASIC) {
        // modify end of basic program pointer
        let end = VZ.start + VZ.data.length;
        if(VZ.start === laser310.mem_read_word(laser310.BASTXT)) laser310.mem_write_word(laser310.BASEND, end+1);
        if(runAfterLoad) {
            laser310.paste("RUN\n");
        }
    }
}
*/

export async function save_vz(filename: string, start_address: number, end_address: number) {
    let type = VZ_BINARY;

    let start: number, end: number;

    if(start_address == undefined || end_address == undefined) {
        start = laser310.mem_read_word(laser310.BASTXT);
        end = laser310.mem_read_word(laser310.BASEND)-1;
        type = VZ_BASIC;
    }
    else {
        start = start_address;
        end = end_address;
    }

    let data = [];
    for(let i=0,t=start; t<=end; i++,t++) {
        data.push(laser310.mem_read(t));
    }

    // make name uppercase and remove extension
    let vzname = filename.toUpperCase().replace(".VZ","");

    let VZ = packvz(vzname, type, start, new Uint8Array(data));    

    if(type == VZ_BASIC) {
        console.log(`saved "${filename}" as BASIC program of ${data.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    }
    else if(type == VZ_BINARY) {
        console.log(`saved "${filename}" as binary data of ${data.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    }

    downloadBytes(filename, VZ);
}

